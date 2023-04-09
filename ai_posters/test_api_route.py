import os
import requests
import json
import base64


def save_images(response, directory, entity_name):
    res_content = dict(json.loads(response.content))
    # print(res_img)
    for idx, img in enumerate(res_content['artifacts']):
        img_data = base64.b64decode(img['base64'])
        seed = img['seed']
        print(seed)
        with open(f"{entity_name}_{idx}.jpg", "wb") as f:
            f.write(img_data)


def make_poster_for_movie(movie: str, genres: str, movie_id: str) -> None:
    # try to load the api key from file
    secrets_filename = os.path.join(os.path.abspath(
        os.path.dirname(__file__)), 'secret.txt')
    try:
        with open(secrets_filename, 'r') as f:
            api_key = f.read().strip()

            engines_list_url = "https://api.stability.ai/v1/engines/list"
            generation_url = "https://api.stability.ai/v1/generation/stable-diffusion-512-v2-1/text-to-image"
            headers = {"Authorization": f"Bearer {api_key}"}

            # GET THE LIST OF ENGINES AVAILABLE
            # response = requests.get(url=engines_list_url, headers=headers)
            # print(response)

            # data = json.loads(response.content)
            # for engine in data:
            #     print(engine)

            clean_title = movie[:-6].strip()

            response = requests.post(generation_url, headers=headers, json={"width": 512, "height": 512, "text_prompts": [
                {
                    "text": movie,
                    "weight": 6
                },
            ], 
                "samples": 1})
            print(response)

            if response.status_code == 200:
                save_images(response, 'generated_images', movie_id)
                print('Images saved successfully')
            else:
                print(response.status_code, response.text)

    except Exception as e:
        print(f'Exception while reading {secrets_filename}')
        print(e)

        # {
        #     "text": "advertisement",
        #     "weight": 1
        # },
        # {
        #     "text": "artistic",
        #     "weight": 1
        # },
        # {
        #     "text": "title text centered",
        #     "weight": 1
        # },
        # {
        #     "text": clean_title,
        #     "weight": 5
        # },
        # {
        #     "text": "characters facing forward",
        #     "weight": 3
        # },
        # {
        #     "text": genres,
        #     "weight": 1
        # },
        # {
        #     "text": "billboard poster ad",
        #     "weight": 2
        # },
        # {
        #     "text": "movie",
        #     "weight": 2
        # },
