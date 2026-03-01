import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

# Define paths
DATASET_PATH = os.path.join(os.path.dirname(__file__), 'dataset', 'Phishing_Email.csv')
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'email_security_model.pkl')

def train():
    print("Loading dataset...")
    if not os.path.exists(DATASET_PATH):
        print(f"Error: Dataset not found at {DATASET_PATH}")
        return

    try:
        # Load dataset
        # The dataset has 'Email Text' and 'Email Type' columns based on inspection
        df = pd.read_csv(DATASET_PATH)
        
        # Handle missing values
        df = df.dropna(subset=['Email Text', 'Email Type'])
        
        # Split data
        X = df['Email Text']
        y = df['Email Type']
        
        print(f"Dataset loaded. {len(df)} records.")
        print("Splitting data...")
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Create a pipeline
        print("Training model (this may take a minute)...")
        pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(stop_words='english', max_features=10000)),
            ('clf', MultinomialNB()),
        ])
        
        # Train
        pipeline.fit(X_train, y_train)
        
        # Evaluate
        print("Evaluating model...")
        y_pred = pipeline.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"Model Accuracy: {accuracy:.4f}")
        print("Classification Report:")
        print(classification_report(y_test, y_pred))
        
        # Save model
        print(f"Saving model to {MODEL_PATH}...")
        joblib.dump(pipeline, MODEL_PATH)
        print("Done!")
        
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    train()
