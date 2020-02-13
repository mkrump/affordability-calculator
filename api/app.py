from flask import Flask
from flask_restful import Api

from resources.income_dist import IncomeDist

app = Flask(__name__)
app.config.from_object("settings")
api = Api(app)

api.add_resource(IncomeDist, '/income-dist', '/income-dist/<int:msa>',
                 resource_class_kwargs={'census_api_key': app.config["CENSUS_API_KEY"]})

if __name__ == '__main__':
    app.run(host=app.config["HOST"], debug=app.config["DEBUG"], port=app.config["PORT"])
