from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from transformers import ViltProcessor, ViltForQuestionAnswering
from PIL import Image
import io
import base64

app = Flask(__name__)
CORS(app)

# Load the model and processor once when the app starts
processor = ViltProcessor.from_pretrained("dandelin/vilt-b32-finetuned-vqa")
model = ViltForQuestionAnswering.from_pretrained("dandelin/vilt-b32-finetuned-vqa")

def analyze_image_description_match(image_data, description):
    """
    Check if the description matches the image using a VQA model.
    """
    try:
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        question = f"Is there a {description} in this image?"
        encoding = processor(image, question, return_tensors="pt")
        outputs = model(**encoding)
        logits = outputs.logits
        predicted_idx = logits.argmax(-1).item()
        answer = model.config.id2label[predicted_idx]

        if answer.lower() == 'yes':
            return True, "Description appears to match the image."
        else:
            return False, f"The model could not confirm the description (responded '{answer}')."

    except Exception as e:
        return False, f"Error during image analysis: {str(e)}"

def check_civic_issue(description, image_data):
    """
    Enhanced check if the image/description represents a civic issue.
    Returns a dictionary with details on success.
    """
    municipal_categories = {
        'roads_infrastructure': {
            'keywords': ['pothole', 'broken road', 'cracked pavement', 'road damage', 'asphalt', 
                        'street surface', 'road repair', 'uneven road', 'road construction'],
            'department': 'Public Works Department'
        },
        'lighting': {
            'keywords': ['street light', 'lamp post', 'broken light', 'dark street', 'lighting',
                        'street lamp', 'traffic light', 'signal light', 'pedestrian light'],
            'department': 'Electrical/Public Works Department'
        },
        'waste_management': {
            'keywords': ['garbage', 'waste', 'trash', 'litter', 'dump', 'refuse',
                        'garbage bin', 'waste collection', 'dirty street', 'overflowing bin'],
            'department': 'Waste Management Department'
        },
        'water_drainage': {
            'keywords': ['water leak', 'drain', 'sewer', 'flooding', 'blocked drain',
                        'water pipe', 'burst pipe', 'manhole', 'storm drain', 'waterlogging'],
            'department': 'Water & Sewerage Department'
        },
        'public_spaces': {
            'keywords': ['park', 'playground', 'garden', 'public space', 'bench',
                        'public toilet', 'community center', 'sidewalk', 'footpath', 'crosswalk'],
            'department': 'Parks & Recreation Department'
        },
        'traffic_transport': {
            'keywords': ['bus stop', 'traffic sign', 'road sign', 'zebra crossing',
                        'traffic signal', 'bus shelter', 'parking', 'illegal parking'],
            'department': 'Transport Department'
        },
        'public_safety': {
            'keywords': ['broken fence', 'damaged barrier', 'unsafe structure', 'hazard',
                        'public safety', 'damaged property', 'fallen tree'],
            'department': 'Municipal Corporation Safety'
        },
        'environmental': {
            'keywords': ['overgrown vegetation', 'tree maintenance', 'noise pollution',
                        'air pollution', 'stray animals', 'pest control'],
            'department': 'Environmental Health Department'
        },
        'public_amenities': {
            'keywords': ['public building', 'government office', 'civic center',
                        'public facility', 'community hall'],
            'department': 'Municipal Administration'
        }
    }
    
    description_lower = description.lower()
    detected_categories = []
    responsible_departments = set()
    
    for category, data in municipal_categories.items():
        found_keywords = [kw for kw in data['keywords'] if kw in description_lower]
        if found_keywords:
            detected_categories.append({
                'category': category,
                'keywords': found_keywords,
                'department': data['department']
            })
            responsible_departments.add(data['department'])
    
    non_municipal_indicators = {
        'private_property': ['private property', 'inside building', 'apartment', 'house interior', 
                           'office', 'shop interior', 'private residence', 'personal property'],
        'private_services': ['private car', 'personal vehicle', 'individual problem', 
                           'private business', 'commercial property'],
        'non_municipal_jurisdiction': ['highway', 'national road', 'state highway', 'railway',
                                     'airport', 'port', 'industrial area'],
        'personal_issues': ['my car', 'personal', 'individual', 'private matter']
    }
    
    for category, indicators in non_municipal_indicators.items():
        for indicator in indicators:
            if indicator in description_lower:
                return False, f"This appears to be {category.replace('_', ' ')}, not under municipal jurisdiction"
    
    if len(description.strip()) < 15:
        return False, "Please provide a more detailed description of the issue (minimum 15 characters)"
    
    if not detected_categories:
        return False, "This doesn't appear to be an issue that falls under municipal authority. Municipal authorities typically handle: roads, lighting, waste, water/drainage, parks, traffic signs, and public amenities."
    
    # MODIFICATION 1: Return a dictionary with structured data on success
    category_names = [cat['category'].replace('_', ' ').title() for cat in detected_categories]
    all_keywords = []
    for cat in detected_categories:
        all_keywords.extend(cat['keywords'])
    
    departments = list(responsible_departments)
    
    success_message = f"Valid municipal issue detected!\n"
    success_message += f"Category: {', '.join(category_names)}\n"
    success_message += f"Keywords found: {', '.join(all_keywords)}\n"
    success_message += f"Responsible Department(s): {', '.join(departments)}"

    result_data = {
        "details": success_message,
        "categories": [cat['category'] for cat in detected_categories],
        "keywords": all_keywords,
        "departments": departments
    }
    
    return True, result_data

@app.route('/analyze', methods=['POST'])
def analyze_civic_issue():
    try:
        data = request.get_json()
        
        if not data or 'image' not in data or 'description' not in data:
            return jsonify({
                'success': False,
                'message': 'Missing image or description data'
            }), 400
        
        image_base64 = data['image']
        description = data['description']
        
        if 'base64,' in image_base64:
            image_base64 = image_base64.split('base64,')[1]
        
        matches_image, match_message = analyze_image_description_match(image_base64, description)
        
        if not matches_image:
            return jsonify({
                'success': False,
                'message': f"Description doesn't match image: {match_message}"
            })
        
        is_civic_issue, civic_data = check_civic_issue(description, image_base64)
        
        if not is_civic_issue:
            return jsonify({
                'success': False,
                'message': civic_data # This is the rejection message string
            })
        
        # MODIFICATION 2: Build the new successful JSON response
        return jsonify({
            'success': True,
            'message': "Valid civic issue submitted successfully!",
            'category': civic_data['categories'][0] if civic_data['categories'] else 'general',
            'details': civic_data['details']
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Civic issue analyzer is running'})

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'Civic Issue Analyzer API',
        'endpoints': {
            'POST /analyze': 'Analyze image and description for civic issues',
            'GET /health': 'Health check'
        }
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)