extends SceneTree

func _initialize() -> void:
	var state_script = load("res://scripts/state/GameState.gd")
	var state: LibraryMagicGameState = state_script.new()
	var page_scene: PackedScene = load("res://scenes/books/BookPage.tscn")
	var books := _load_json_array("res://data/books.json")
	var failures: Array[String] = []

	for book in books:
		var page = page_scene.instantiate()
		root.add_child(page)
		page.setup(book, state)
		page._on_action_pressed()
		var book_id := str(book.get("id", ""))
		var resource_id := str(book.get("resourceId", "mana"))
		var stock := state.resource_stock(resource_id)
		if stock <= 0:
			failures.append("%s did not produce %s" % [book_id, resource_id])
		page.queue_free()

	if failures.is_empty():
		print("verify_book_pages ok")
		quit(0)
		return

	for failure in failures:
		push_error(failure)
	quit(1)

func _load_json_array(resource_path: String) -> Array:
	var file := FileAccess.open(resource_path, FileAccess.READ)
	if file == null:
		push_error("Missing data: %s" % resource_path)
		return []

	var parsed = JSON.parse_string(file.get_as_text())
	if typeof(parsed) != TYPE_ARRAY:
		push_error("Expected JSON array: %s" % resource_path)
		return []
	return parsed
