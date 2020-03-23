.PHONY: pack

pack:
	@echo 'Zipping component pack files...'
	@find . \( -name "*.js" -o -name "*.css"   -o -name "*.json" \) | zip -@ $(shell basename $(CURDIR)).zip
