from flask import Flask, render_template, flash, redirect, jsonify, request
import os
from PIL import Image, ImageDraw, ImageFont
import re
import io
import binascii
import time


#template_dir = os.path.abspath('./frontend/')

#app = Flask(__name__, template_folder=template_dir)
app = Flask(__name__)

IMG_PATH = "img/"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods = ["POST"])
def predict():
    print("entro a predict")
    n_pics = int(request.form["text"])
    for ind in range(1, n_pics+1):
        file = request.files["json"+str(ind)]
        file.save(os.path.join("img/",file.filename))

    return jsonify({'status': 201})


if __name__ == "__main__":
    app.run(debug = True, port = 8000, host="0.0.0.0")