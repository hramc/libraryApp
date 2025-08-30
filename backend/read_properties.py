def read_properties(filepath):
    """
    Reads a simple key-value properties file into a dictionary.
    Skips comments and blank lines.
    """
    props = {}
    with open(filepath, 'r') as f:
        for line in f:
            line = line.strip()
            # Ignore comments and blank lines
            if not line or line.startswith('#'):
                continue

            # Split the line at the first '='
            key, value = line.split('=', 1)
            props[key.strip()] = value.strip()

    return props

# --- Example Usage ---
properties_file = 'app.properties'
config = read_properties(properties_file)

# Access your properties
#print(f"Database URL: {config.get('DATABASE_URL')}")
#print(f"API Key: {config.get('API_KEY')}")

# Add error handling for non-existent keys
#print(f"Non-existent key: {config.get('NON_EXISTENT_KEY', 'default_value')}")
