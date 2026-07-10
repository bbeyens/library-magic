extends SceneTree

const MainScene = preload("res://scenes/Main.tscn")

func _init() -> void:
	call_deferred("_run")

func _run() -> void:
	root.size = Vector2i(1000, 1000)
	var main := MainScene.instantiate()
	root.add_child(main)
	await process_frame
	await process_frame

	var stage: Control = main.get_node("Stage")
	var click_position := stage.global_position + (Vector2(193.0, 213.0) * stage.scale.x)
	_send_click(click_position)
	await process_frame
	await process_frame

	if main.active_book_page == null:
		push_error("Mana book click did not open BookPage")
		quit(1)
		return

	print("verify_main_interactions ok")
	quit(0)

func _send_click(position: Vector2) -> void:
	var press := InputEventMouseButton.new()
	press.button_index = MOUSE_BUTTON_LEFT
	press.pressed = true
	press.position = position
	Input.parse_input_event(press)

	var release := InputEventMouseButton.new()
	release.button_index = MOUSE_BUTTON_LEFT
	release.pressed = false
	release.position = position
	Input.parse_input_event(release)
