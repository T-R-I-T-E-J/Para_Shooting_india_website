#!/bin/bash
sudo -u postgres psql -d para_shooting_db -t -c "SELECT featured_image_url FROM news_articles ORDER BY created_at DESC LIMIT 5;"
