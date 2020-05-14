import face_recognition
import requests
from flask import Flask, make_response, request
from markupsafe import escape
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
cred = credentials.Certificate(
    'ifra-3d775-firebase-adminsdk-8jb73-ee58799393.json')
firebase_admin.initialize_app(cred)


@app.route('/recognise', methods=["GET", "POST"])
def recognise_face():

    db = firestore.client()

    sightings_ref = db.collection(u'sightings_custom_api')

    personId = request.json['missingPersonId']
    missing_person_ref = db.collection(
        u'missing_persons').document(str(personId)).get()

    sighted_image_list = request.json['images']
    missing_person_image = missing_person_ref.to_dict()['imageUrl']

    with open('missing_person_image.jpg', 'wb') as handle:
        response = requests.get(missing_person_image, stream=True)

        if not response.ok:
            print(response)

        for block in response.iter_content(1024):
            if not block:
                break

            handle.write(block)

    image_index = 0
    index_list = []
    for image in sighted_image_list:
        with open(f'sighted_person_image_{image_index}.jpg', 'wb') as handle:
            response = requests.get(image, stream=True)

            if not response.ok:
                print(response)

            for block in response.iter_content(1024):
                if not block:
                    break

                handle.write(block)
        index_list.append(image_index)
        image_index += 1

    missing_person_image = face_recognition.load_image_file(
        "missing_person_image.jpg")
    missing_person_image_encoding = face_recognition.face_encodings(
        missing_person_image)[0]

    results = []
    predictions = {}
    for index in index_list:
        sighted_person_image = face_recognition.load_image_file(
            f'sighted_person_image_{index}.jpg')
        sighted_person_image_encodings = face_recognition.face_encodings(
            sighted_person_image)

        distances = []
        for image_encoding in sighted_person_image_encodings:
            distances.append(face_recognition.face_distance(
                [missing_person_image_encoding], image_encoding)[0])

        predictions[str(index)] = []
        percentage_distance_list = []
        def clamp(n, minn, maxn): return max(min(maxn, n), minn)
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

    print(predictions)


    data = {
        'images': request.json['images'],
        'location': request.json['location'],
        'latitude': request.json['latitude'],
        'longitude': request.json['longitude'],
        'wasAlone': request.json['wasAlone'],
        'contactDetails': request.json['contactDetails'],
        'missingPersonId': request.json['missingPersonId'],
        'additionalPersonDescription': request.json['additionalPersonDescription'],
        'predictions': predictions,
        'imageWithHighestAccuracy': {
                                        'accuracy': max(results),
                                        'image': sighted_image_list[results.index(max(results))]
                                    }
       }

    print(data)

    sightings_ref.document().create(data)

    return make_response(data, 200)



# @app.route('/test', methods=["GET", "POST"])
# def test():
#     sighted_image_list = request.json
#     # personId = request.form['missingPersonId']

#     for image in sighted_image_list['image_1']:
#         print(image)
#     # print(personId)

#     return make_response("data", 200)
