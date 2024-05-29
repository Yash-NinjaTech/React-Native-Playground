#!/bin/bash

# Simplenight Base URL for OpenAPI docs
BASE_URL="https://api.dev.v4.simplenight.com/api"

generate_commerce_client() {
    local output_dir=$1

    local swagger_url="${BASE_URL}/docs/v1/swagger-commerce.json"

    echo "Generating client for commerce"

    # Generate client
    npx @hey-api/openapi-ts \
        --input "${swagger_url}" \
        --output "${output_dir}" \
        --client fetch \
        --name "ApiCommerce"

    echo "Client generated for commerce at ${output_dir}"
}

generate_core_client() {
    local output_dir=$1

    local swagger_url="${BASE_URL}/docs-json"

    echo "Generating core client to ${output_dir}"

    # Generate client
    npx @hey-api/openapi-ts \
        --input "${swagger_url}" \
        --output "${output_dir}" \
        --client fetch \
        --name "ApiCore"

    echo "Client generated for core at ${output_dir}"
}

move_logs_to_directory() {
    local log_directory="$1"  # Directory to move logs to, passed as an argument

    # Create the directory if it does not exist
    mkdir -p "$log_directory"

    # Move all log files with the specified pattern to the logs directory
    mv openapi-ts-error-*.log "$log_directory/"
}

generate_core_client "./api/core"

generate_commerce_client "./api/commerce"

# Move logs to a directory
move_logs_to_directory "./logs"

echo "Clients generation complete for all services."
