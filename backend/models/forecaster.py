import pandas as pd
import numpy as np
from neuralprophet import NeuralProphet
import matplotlib.pyplot as plt
import os
import joblib
from datetime import datetime, timedelta

class EnergyDemandForecaster:
    def __init__(self):
        self.model = None
        self.forecast_periods = 24  # Default to forecasting 24 hours
        self.model_path = os.path.join(os.path.dirname(__file__), 'saved_models', 'forecaster_model.pkl')
        self.metrics = {}
        
    def _create_sample_data(self, days=60):
        """Create sample energy demand data for training since no data exists"""
        np.random.seed(42)
        
        # Generate dates for the past 60 days with hourly data
        end_date = datetime.now().replace(minute=0, second=0, microsecond=0)
        start_date = end_date - timedelta(days=days)
        
        # Generate datetime range
        dates = pd.date_range(start=start_date, end=end_date, freq='H')
        
        # Base demand with daily and weekly seasonality
        base_demand = 100  # Base load in kW
        
        # Create dataframe
        df = pd.DataFrame({'ds': dates})
        
        # Add hour of day effect (peak in morning and evening)
        hour_effect = np.sin(np.pi * df.ds.dt.hour / 12) * 30
        
        # Add day of week effect (weekdays higher than weekends)
        weekday_effect = (df.ds.dt.dayofweek < 5).astype(int) * 20
        
        # Add temperature effect (proxy with month - higher in summer/winter for AC/heating)
        month = df.ds.dt.month
        temp_effect = -np.abs((month - 6.5)) + 6.5  # Peak in summer (month 7)
        temp_effect = temp_effect * 5  # Scale effect
        
        # Add some random noise
        noise = np.random.normal(0, 5, size=len(df))
        
        # Calculate final demand
        y = base_demand + hour_effect + weekday_effect + temp_effect + noise
        
        # Add some growth trend
        trend = np.linspace(0, 15, len(df))
        y = y + trend
        
        # Add special events (e.g., holidays with lower demand)
        # Let's add a few random "holidays" with 30% lower demand
        holiday_idx = np.random.choice(range(len(df)), size=5, replace=False)
        y[holiday_idx] = y[holiday_idx] * 0.7
        
        # Add sudden spikes (e.g., extreme weather events)
        spike_idx = np.random.choice(range(len(df)), size=3, replace=False)
        y[spike_idx] = y[spike_idx] * 1.5
        
        df['y'] = y
        
        return df
    
    def train(self, data=None):
        """Train the forecaster with historical energy demand data"""
        if data is None:
            data = self._create_sample_data()
            
        # Configure and train NeuralProphet model
        self.model = NeuralProphet(
            growth="linear",  # Allow for trend
            changepoints=10,  # Allow for trend changes
            n_changepoints=10,
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=True,
            batch_size=64,
            epochs=100,
            learning_rate=0.01
        )
        
        # Add country holidays
        self.model.add_country_holidays(country_name='US')
        
        # Fit the model
        metrics = self.model.fit(data, freq="H")
        self.metrics = {
            'mae': metrics['mae'].iloc[-1],
            'rmse': metrics['rmse'].iloc[-1]
        }
        
        # Save the model
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        model_data = {
            'model': self.model,
            'metrics': self.metrics,
            'last_train_date': data['ds'].max()
        }
        joblib.dump(model_data, self.model_path)
        
    def load_model(self):
        """Load a trained model if it exists"""
        if os.path.exists(self.model_path):
            model_data = joblib.load(self.model_path)
            self.model = model_data['model']
            self.metrics = model_data.get('metrics', {})
            return True
        return False
    
    def forecast(self, periods=None, return_components=False):
        """Generate energy demand forecast"""
        if self.model is None:
            if not self.load_model():
                self.train()
                
        periods = periods or self.forecast_periods
        
        # Create future dataframe for prediction
        future = self.model.make_future_dataframe(
            df=pd.DataFrame(), periods=periods, freq='H'
        )
        
        # Make prediction
        forecast = self.model.predict(future)
        
        if return_components:
            components = self.model.predict_components(future)
            return forecast, components
        
        return forecast
    
    def plot_forecast(self, periods=None, include_history=True, save_path=None):
        """Plot the forecasted energy demand"""
        if self.model is None:
            if not self.load_model():
                self.train()
                
        periods = periods or self.forecast_periods
        
        # Create a sample of historical data for plotting
        if include_history:
            history = self._create_sample_data(days=7)  # Last 7 days for visualization
        else:
            history = None
            
        # Plot the forecast
        fig = self.model.plot(self.forecast(periods), history)
        
        if save_path:
            fig.savefig(save_path)
            
        return fig
        
    def plot_components(self, periods=None, save_path=None):
        """Plot the components of the forecast"""
        if self.model is None:
            if not self.load_model():
                self.train()
                
        periods = periods or self.forecast_periods
        
        # Plot the components
        forecast = self.forecast(periods)
        fig = self.model.plot_components(forecast)
        
        if save_path:
            fig.savefig(save_path)
            
        return fig
        
    def get_performance_metrics(self):
        """Return model performance metrics"""
        if not self.metrics and self.model is None:
            if not self.load_model():
                self.train()
                
        return self.metrics 
