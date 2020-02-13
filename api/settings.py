import os

from environs import Env

env = Env()
env.read_env()

# CENSUS_API_KEY is required
CENSUS_API_KEY = env.str("CENSUS_API_KEY")
DEBUG = env.str("DEBUG")
HOST = env.str("HOST")
PORT = env.str("PORT")

