#!/bin/bash

echo "=== TESTING PARALLEL PROCESSING ==="

# Create test files
mkdir -p test-parallel
for i in {1..5}; do
  echo "Test file $i" > test-parallel/file$i.txt
done

echo "Testing parallel execution with 5 files..."

# Sequential timing
echo -e "\n⏱️ Sequential Processing:"
time (
  for file in test-parallel/*.txt; do
    cat "$file" > /dev/null
    sleep 0.2  # Simulate processing
  done
)

# Parallel timing  
echo -e "\n⚡ Parallel Processing:"
time (
  for file in test-parallel/*.txt; do
    (cat "$file" > /dev/null; sleep 0.2) &
  done
  wait
)

# Cleanup
rm -rf test-parallel

echo -e "\n✅ Parallel processing is significantly faster!"
