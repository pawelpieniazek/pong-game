
from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, send, join_room, leave_room

app = Flask(__name__)
app.config["SECRET_KEY"] = 'halo'
socketio = SocketIO(app)

USERS = []

@socketio.on('username')
def new_username(data):
    username = ""
    username = data["username"]
    for user in USERS:
        if user['username'] == username:
            return
    new_user = {'username': username, 'points': 0}
    USERS.append(new_user)

@socketio.on('points')
def points(data):
    points = int(data['points'])
    username = data['username']
    for user in USERS:
        if user['username'] == username:
            user['points'] += points
    
def sort_function(e):
  return e['points']

@socketio.on('get ranking')
def get_ranking():
    USERS.sort(reverse=True, key=sort_function)
    emit('ranking', USERS)
    
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/singleeasy", methods = ['GET', 'POST'])
def easy():
    return render_template("singleeasy.html")

@app.route("/singlemedium", methods = ['GET', 'POST'])
def medium():
    return render_template("singlemedium.html")

@app.route("/singlehard", methods = ['GET', 'POST'])
def hard():
    return render_template("singlehard.html")

@app.route("/multi", methods = ['GET', 'POST'])
def multi():
    return render_template("multi.html")

@app.route("/multivscomputer", methods = ['GET', 'POST'])
def multivscomputer():
    return render_template("multivscomputer.html")

if __name__ == '__main__':
    socketio.run(app, debug=True, use_reloader=True)
