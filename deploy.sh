#!/bin/sh
gulp copyResources
gulp minifyHTML
gulp uglify
gulp deploy
gulp size