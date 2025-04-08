from flask import Flask, request, jsonify
from flask_cors import CORS
import os

from api.recommender_routes import recommender_bp
from api.forecast_routes import forecast_bp

app = Flask(__name__)
# Enable CORS for all domains
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Register blueprints
app.register_blueprint(recommender_bp, url_prefix='/api/recommender')
app.register_blueprint(forecast_bp, url_prefix='/api/forecast')

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Renewable Energy API is running"}), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    # Use host='0.0.0.0' to make Flask accessible from any address
    app.run(host='0.0.0.0', port=port, debug=False) 