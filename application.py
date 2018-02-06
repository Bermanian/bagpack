import os
import re
from flask import Flask, jsonify, render_template, request, url_for
from flask_jsglue import JSGlue

from cs50 import SQL
from helpers import fweather

# configure application
app = Flask(__name__)
JSGlue(app)

# ensure responses aren't cached
if app.config["DEBUG"]:
    @app.after_request
    def after_request(response):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Expires"] = 0
        response.headers["Pragma"] = "no-cache"
        return response

# configure CS50 Library to use SQLite database
db = SQL("sqlite:///bagpack.db")

@app.route("/")
def index():

    """Render map."""

    return render_template("index.html", key="AIzaSyDDMaVWwemBwwFBkYSagN-U2f0fDK_3vHg")

@app.route("/weather")
def weather():
    """Look up weather for geo."""
    geo=request.args.get("geo")
    weather={}
    if not geo:
        return RuntimeError
    weather=fweather(geo)


     # let Javascript do all the job
    return jsonify(weather)

@app.route("/equip")
def equip():
    """Search for places that match query."""
    q=request.args.get("q")
    t = request.args.get("t")
    if(t):
        equip={}
        query = "SELECT name FROM items WHERE " +q + "= 1 AND (cold_weather = '1' or cold_weather = 'Null')"
        equip=db.execute(query)
        if equip:
            return jsonify(equip)
    else:
        equip={}
        query = "SELECT name FROM items WHERE " +q + "=1 AND (cold_weather = '0' or cold_weather = 'Null')"
        equip=db.execute(query)
        if equip:
            return jsonify(equip)
