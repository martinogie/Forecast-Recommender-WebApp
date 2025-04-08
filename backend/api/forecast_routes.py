from flask import Blueprint, request, jsonify, send_file
from models.forecaster import EnergyDemandForecaster
import pandas as pd
import os
import tempfile
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend

forecast_bp = Blueprint('forecast', __name__)
forecaster = EnergyDemandForecaster()

@forecast_bp.route('/train', methods=['POST'])
def train_forecaster():
    """Endpoint to train or retrain the forecaster"""
    try:
        data = request.get_json()
        historical_data = data.get('historical_data')
        
        if historical_data:
            # Convert to dataframe
            df = pd.DataFrame(historical_data)
            # Ensure column names match what the model expects
            if 'ds' not in df.columns or 'y' not in df.columns:
                return jsonify({
                    "success": False,
                    "message": "Data must contain 'ds' (datetime) and 'y' (energy demand) columns"
                }), 400
                
            forecaster.train(df)
            return jsonify({
                "success": True,
                "message": "Forecaster trained successfully with provided data"
            }), 200
        else:
            # Train with sample data
            forecaster.train()
            return jsonify({
                "success": True,
                "message": "Forecaster trained with sample data"
            }), 200
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error training forecaster: {str(e)}"
        }), 500

@forecast_bp.route('/predict', methods=['GET'])
def get_forecast():
    """Get energy demand forecast for future periods"""
    try:
        periods = request.args.get('periods', default=24, type=int)
        
        forecast = forecaster.forecast(periods=periods)
        
        # Convert to list of dicts for JSON serialization
        forecast_data = forecast.to_dict('records')
        
        return jsonify({
            "success": True,
            "periods": periods,
            "forecast": forecast_data
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error getting forecast: {str(e)}"
        }), 500

@forecast_bp.route('/metrics', methods=['GET'])
def get_metrics():
    """Get performance metrics of the forecasting model"""
    try:
        metrics = forecaster.get_performance_metrics()
        
        return jsonify({
            "success": True,
            "metrics": metrics
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error getting metrics: {str(e)}"
        }), 500

@forecast_bp.route('/plot', methods=['GET'])
def get_forecast_plot():
    """Get a plot visualization of the energy demand forecast"""
    try:
        periods = request.args.get('periods', default=24, type=int)
        include_history = request.args.get('include_history', default='true').lower() == 'true'
        
        # Create a temporary file for the plot
        with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmp:
            temp_path = tmp.name
            
        # Generate and save the plot
        forecaster.plot_forecast(periods=periods, include_history=include_history, save_path=temp_path)
        
        # Send the file
        return send_file(temp_path, mimetype='image/png', as_attachment=True, 
                        download_name='energy_forecast.png'), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error generating forecast plot: {str(e)}"
        }), 500
        
@forecast_bp.route('/plot/components', methods=['GET'])
def get_components_plot():
    """Get a plot visualization of the forecast components"""
    try:
        periods = request.args.get('periods', default=24, type=int)
        
        # Create a temporary file for the plot
        with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmp:
            temp_path = tmp.name
            
        # Generate and save the plot
        forecaster.plot_components(periods=periods, save_path=temp_path)
        
        # Send the file
        return send_file(temp_path, mimetype='image/png', as_attachment=True, 
                        download_name='forecast_components.png'), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error generating components plot: {str(e)}"
        }), 500 