from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # این خط برای ارتباط بین Flask و React ضروری است

@app.route('/api/location', methods=['GET'])
def get_location():
    return jsonify({
        'city': 'Tehran',
        'position': [35.6892, 51.3890],
        'message': 'تهران - پایتخت ایران'
    })

if __name__ == '__main__':
    app.run(debug=True)