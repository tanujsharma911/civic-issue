# encode_image.py (UPDATED)
import base64

def image_to_file(file_path):
    """Reads an image and saves its base64 string to a text file."""
    output_filename = f"{file_path.split('.')[0]}_base64.txt"
    try:
        with open(file_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

        with open(output_filename, "w") as text_file:
            text_file.write(encoded_string)

        print(f"✅ Successfully created '{output_filename}'")

    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")

# Convert just the pothole image
image_to_file("pothole.jpg")