import face_recognition
import requests
from flask import Flask, make_response, request
from markupsafe import escape
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from flask_cors import CORS
import os

# Create a Flask App
app = Flask(__name__)

# Allow CORS for all domains on all routes
CORS(app)

# Initialise firebase app and client
cred = credentials.Certificate(
    'ifra-3d775-firebase-adminsdk-8jb73-10d73d5f86.json')
firebase_admin.initialize_app(cred)
db = firestore.client()


@app.route('/recognise', methods=["GET", "POST"])
def recognise_face():

    # Fetch missingPersonId and images posted by the user
    personId = request.json['issueNumber']
    sighted_image_list = request.json['images']

    # Fetch the document of corresponding missing person from firestore and store his image URL
    missing_person_ref = db.collection(
        u'missing_persons').document(str(personId)).get()
    missing_person_image = missing_person_ref.to_dict()['imageUrl']

    # Create missing person image file from URL
    createImageFileFromUrl('missing_person_image.jpg', missing_person_image)

    # Create missing person image file from URL (multiple images can be uploaded by the user)
    image_index = 0
    index_list = []
    for sighted_image in sighted_image_list:
        createImageFileFromUrl(
            f'sighted_person_image_{image_index}.jpg', sighted_image)
        index_list.append(image_index)
        image_index += 1

    # Calculate the face encoding of missing person image
    missing_person_image = face_recognition.load_image_file(
        "missing_person_image.jpg")
    missing_person_image_encoding = face_recognition.face_encodings(
        missing_person_image)[0]

    # Calculate the results and prediction
    [results, predictions] = calculatePredictions(
        missing_person_image_encoding, index_list)

    # Create and store the data to firebase
    createAndStoreData(results, predictions, sighted_image_list)

    # Delete the created image files
    os.remove('missing_person_image.jpg')
    for image_index in index_list:
        os.remove(
            f'sighted_person_image_{image_index}.jpg')

    return make_response("Successful", 200)


def createAndStoreData(results, predictions, sighted_image_list):
    """
    Parameters
    ----------
    results : list
        List of percentage match in each image
    missing_person_image_encoding : map
        Map containing percentage match and boolean saying whether the images are identical
    sighted_image_list : list
        List containing all the sighted images
    """

    sightings_ref = db.collection(u'sightings_custom_api')

    data = {
        'images': request.json['images'],
        'location': request.json['location'],
        'latitude': request.json['latitude'],
        'longitude': request.json['longitude'],
        'wasAlone': request.json['wasAlone'],
        'contactDetails': request.json['contactDetails'],
        'issueNumber': request.json['issueNumber'],
        'additionalPersonDescription': request.json['additionalPersonDescription'],
        'sightedAt': request.json['sightedAt'],
        'predictions': predictions,
        'imageWithHighestAccuracy': {
            'accuracy': max(results),
            'image': sighted_image_list[results.index(max(results))]
        }
    }

    sightings_ref.document().create(data)


def calculatePredictions(missing_person_image_encoding, index_list):
    """
    Parameters
    ----------
    index_list : list
        List of image indexes
    missing_person_image_encoding : array
        Encoding of missing person image

    Returns
    -------
    results
        A list of percentage match in each image
    predictions
        A map containing percentage match and boolean saying whether the images are identical
    """

    results = []
    predictions = {}
    for index in index_list:
        # Calculate the face encoding of sighted person image
        sighted_person_image = face_recognition.load_image_file(
            f'sighted_person_image_{index}.jpg')
        sighted_person_image_encodings = face_recognition.face_encodings(
            sighted_person_image)

        # Calculate distance between missing person image and sighted person image
        distances = []
        for image_encoding in sighted_person_image_encodings:
            distances.append(face_recognition.face_distance(
                [missing_person_image_encoding], image_encoding)[0])

        predictions[str(index)] = []
        percentage_distance_list = []
        for distance in distances:
            # Limiting the result between 0 and 1
            clamped_dis = clamp(distance, 0, 1)
            # Calculate the percentage
            percentage_dis = 1-clamped_dis

            predictions[str(index)].append({
                'confidence': percentage_dis,
                'isIdentical': bool(percentage_dis > 0.5)
            })

            percentage_distance_list.append(percentage_dis)

        results.append(max(percentage_distance_list))

    return results, predictions


def clamp(n, minn, maxn):
    """
    Parameters
    ----------
    n : number
        Number to be clamped
    minn : number
        Lower bound of the clamp
    maxn : number
        Upper bound of the clamp
    """
    return max(min(maxn, n), minn)


def createImageFileFromUrl(imageName, imageUrl):
    """
    Parameters
    ----------
    imageName : str
        This is the name of the image file which will be created
    imageUrl : str
        This is the firebase storage url of the image 
    """
    response = requests.get(imageUrl, stream=True)

    with open(imageName, 'wb') as handle:
        if not response.ok:
            print(response)

        for block in response.iter_content(1024):
            if not block:
                break

            handle.write(block)
