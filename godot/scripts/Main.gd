extends Control

const GameState = preload("res://scripts/state/GameState.gd")
const BookPageScene = preload("res://scenes/books/BookPage.tscn")

const BOOKS_PATH = "res://data/books.json"
const SEALS_PATH = "res://data/forbidden_grimoire_seals.json"
const HUB_TEXTURE_PATH = "res://assets/HUB/forbidden-hub-gameplay-covers-1.jpg"
const MANA_PER_CLICK = 10
const BASE_VIEWPORT_SIZE := Vector2(1280.0, 720.0)

const BOOK_SIZE := Vector2(112.0, 148.0)
const BOOK_POSITIONS := {
	"mana": Vector2(193.0, 213.0),
	"serpent": Vector2(380.0, 213.0),
	"typing": Vector2(553.0, 213.0),
	"herbarium": Vector2(731.0, 213.0),
	"defense": Vector2(193.0, 381.0),
	"blackjack": Vector2(380.0, 381.0),
	"hundred": Vector2(553.0, 381.0),
	"mine": Vector2(731.0, 381.0),
	"targets": Vector2(193.0, 563.0),
	"slimeTrainer": Vector2(731.0, 563.0),
}

const RESOURCE_LABELS := {
	"mana": "Mana",
	"scales": "Ecailles",
	"runes": "Runes",
	"spores": "Spores",
	"sigils": "Sceaux",
	"chips": "Jetons",
	"fragments": "Fragments",
	"minerals": "Pieces",
	"marks": "Marques",
	"gels": "Gels",
}

var state: LibraryMagicGameState = GameState.new()
var books: Array = []
var seals: Array = []
var hovered_book_id := ""

@onready var stage: Control = $Stage
@onready var background: TextureRect = $Stage/Background
@onready var shade: ColorRect = $Stage/Shade
@onready var hud_layer: Control = $Stage/HudLayer
@onready var book_layer: Control = $Stage/BookLayer
@onready var page_layer: Control = $Stage/PageLayer
@onready var ritual_panel: PanelContainer = $Stage/RitualPanel

var active_book_page: Control = null
var mana_label: Label
var key_label: Label
var selected_label: Label
var selected_subtitle: Label
var ritual_title: Label
var ritual_subtitle: Label
var requirements_box: VBoxContainer
var ritual_button: Button
var action_button: Button

func _ready() -> void:
	books = _load_json_array(BOOKS_PATH)
	seals = _load_json_array(SEALS_PATH)
	resized.connect(_fit_stage)
	_fit_stage()
	_setup_background()
	_build_hud()
	_build_ritual_panel()
	_sync_ui()

func _fit_stage() -> void:
	var available := get_viewport_rect().size
	var fit_scale: float = minf(available.x / BASE_VIEWPORT_SIZE.x, available.y / BASE_VIEWPORT_SIZE.y)
	stage.size = BASE_VIEWPORT_SIZE
	stage.scale = Vector2.ONE * fit_scale
	stage.position = (available - (BASE_VIEWPORT_SIZE * fit_scale)) * 0.5

func _setup_background() -> void:
	if ResourceLoader.exists(HUB_TEXTURE_PATH):
		background.texture = load(HUB_TEXTURE_PATH)

func _build_hud() -> void:
	_clear_children(hud_layer)

	var mana_badge := _make_panel(Vector2(434.0, 31.0), Vector2(360.0, 44.0), Color(0.10, 0.07, 0.08, 0.84), Color(0.73, 0.52, 0.35, 0.9))
	hud_layer.add_child(mana_badge)
	mana_label = _make_label("Mana 0", 16, Color(0.96, 0.86, 0.70, 1.0), HORIZONTAL_ALIGNMENT_CENTER)
	_fill_parent(mana_label, Vector2.ZERO, Vector2.ZERO)
	mana_badge.add_child(mana_label)

	var key_badge := _make_panel(Vector2(1078.0, 31.0), Vector2(150.0, 44.0), Color(0.10, 0.07, 0.08, 0.84), Color(0.82, 0.63, 0.36, 0.95))
	hud_layer.add_child(key_badge)
	key_label = _make_label("Cle 0", 15, Color(1.0, 0.87, 0.58, 1.0), HORIZONTAL_ALIGNMENT_CENTER)
	_fill_parent(key_label, Vector2.ZERO, Vector2.ZERO)
	key_badge.add_child(key_label)

	var title := _make_label("Library Magic", 22, Color(1.0, 0.90, 0.68, 1.0), HORIZONTAL_ALIGNMENT_LEFT)
	title.position = Vector2(38.0, 34.0)
	title.size = Vector2(260.0, 34.0)
	hud_layer.add_child(title)

func _build_ritual_panel() -> void:
	_clear_children(ritual_panel)
	ritual_panel.position = Vector2(944.0, 405.0)
	ritual_panel.size = Vector2(286.0, 210.0)
	ritual_panel.add_theme_stylebox_override("panel", _stylebox(Color(0.05, 0.035, 0.045, 0.82), Color(0.47, 0.85, 1.0, 0.55), 10, 2))

	var margin := MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 16)
	margin.add_theme_constant_override("margin_top", 14)
	margin.add_theme_constant_override("margin_right", 16)
	margin.add_theme_constant_override("margin_bottom", 14)
	ritual_panel.add_child(margin)

	var rows := VBoxContainer.new()
	rows.add_theme_constant_override("separation", 10)
	margin.add_child(rows)

	ritual_title = _make_label("Sceau I", 17, Color(0.98, 0.90, 0.72, 1.0), HORIZONTAL_ALIGNMENT_LEFT)
	rows.add_child(ritual_title)

	ritual_subtitle = _make_label("ouvre un livre", 13, Color(0.55, 0.88, 1.0, 1.0), HORIZONTAL_ALIGNMENT_LEFT)
	ritual_subtitle.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	rows.add_child(ritual_subtitle)

	requirements_box = VBoxContainer.new()
	requirements_box.add_theme_constant_override("separation", 6)
	rows.add_child(requirements_box)

	ritual_button = Button.new()
	ritual_button.custom_minimum_size = Vector2(0.0, 36.0)
	ritual_button.text = "Offrir"
	ritual_button.add_theme_font_size_override("font_size", 14)
	ritual_button.pressed.connect(_on_ritual_button_pressed)
	rows.add_child(ritual_button)

func _sync_ui() -> void:
	mana_label.text = "Mana %s" % _format_amount(state.mana)
	key_label.text = "Cle %s" % _format_amount(state.keys)
	_render_books()
	_render_selection()
	_render_ritual_panel()
	if active_book_page != null and active_book_page.has_method("_render"):
		active_book_page._render()

func _render_books() -> void:
	_clear_children(book_layer)

	for book in books:
		var book_id := str(book.get("id", ""))
		var center: Vector2 = BOOK_POSITIONS.get(book_id, Vector2.ZERO)
		var unlocked := state.is_book_unlocked(book_id)
		var selected := state.selected_book_id == book_id
		var hovered := hovered_book_id == book_id
		var accent := Color.html(str(book.get("accent", "#ffe0aa")))
		var card := Control.new()
		card.name = "%sHotspot" % book_id
		card.position = center - (BOOK_SIZE * 0.5)
		card.size = BOOK_SIZE
		card.mouse_filter = Control.MOUSE_FILTER_STOP
		card.gui_input.connect(_on_book_gui_input.bind(book))
		card.mouse_entered.connect(func() -> void:
			hovered_book_id = book_id
			call_deferred("_sync_ui")
		)
		card.mouse_exited.connect(func() -> void:
			if hovered_book_id == book_id:
				hovered_book_id = ""
				call_deferred("_sync_ui")
		)
		book_layer.add_child(card)

		var glow := Panel.new()
		glow.mouse_filter = Control.MOUSE_FILTER_IGNORE
		_fill_parent(glow, Vector2(-7.0, -10.0), Vector2(14.0, 20.0))
		var glow_alpha := 0.30 if hovered else 0.20 if selected else 0.0
		glow.add_theme_stylebox_override("panel", _stylebox(Color(accent.r, accent.g, accent.b, glow_alpha), accent, 9, 1))
		card.add_child(glow)

		var veil := ColorRect.new()
		veil.mouse_filter = Control.MOUSE_FILTER_IGNORE
		_fill_parent(veil, Vector2.ZERO, Vector2.ZERO)
		veil.color = Color(0.02, 0.015, 0.02, 0.13 if unlocked else 0.46)
		card.add_child(veil)

		var icon := TextureRect.new()
		icon.mouse_filter = Control.MOUSE_FILTER_IGNORE
		icon.position = Vector2(24.0, 28.0)
		icon.size = Vector2(64.0, 64.0)
		icon.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		icon.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		var icon_path := "res://assets/library/books/%s.svg" % book_id
		if ResourceLoader.exists(icon_path):
			icon.texture = load(icon_path)
		icon.modulate = Color(1.0, 1.0, 1.0, 0.95 if unlocked else 0.58)
		card.add_child(icon)

		var resource_badge := _make_panel(Vector2(20.0, -16.0), Vector2(72.0, 26.0), Color(0.02, 0.015, 0.02, 0.76), accent, 5, 1)
		resource_badge.mouse_filter = Control.MOUSE_FILTER_IGNORE
		card.add_child(resource_badge)
		var resource_text := _make_label(_format_amount(_book_resource_stock(book)), 12, Color(1.0, 0.94, 0.78, 1.0), HORIZONTAL_ALIGNMENT_CENTER)
		_fill_parent(resource_text, Vector2.ZERO, Vector2.ZERO)
		resource_badge.add_child(resource_text)

		var lock_label := _make_label("SCELLE" if not unlocked else "", 12, Color(1.0, 0.83, 0.58, 1.0), HORIZONTAL_ALIGNMENT_CENTER)
		lock_label.position = Vector2(0.0, 96.0)
		lock_label.size = Vector2(BOOK_SIZE.x, 20.0)
		card.add_child(lock_label)

func _render_selection() -> void:
	var book := _selected_book()
	if book.is_empty():
		return
	var center := Vector2(944.0, 247.0)
	var panel := _make_panel(center, Vector2(286.0, 118.0), Color(0.05, 0.035, 0.045, 0.72), Color(0.73, 0.52, 0.35, 0.42), 8, 1)
	panel.name = "SelectionPanel"
	book_layer.add_child(panel)

	selected_label = _make_label(str(book.get("name", "")), 16, Color(1.0, 0.91, 0.72, 1.0), HORIZONTAL_ALIGNMENT_LEFT)
	selected_label.position = Vector2(18.0, 12.0)
	selected_label.size = Vector2(250.0, 24.0)
	panel.add_child(selected_label)

	selected_subtitle = _make_label(str(book.get("subtitle", "")), 12, Color(0.88, 0.78, 0.62, 1.0), HORIZONTAL_ALIGNMENT_LEFT)
	selected_subtitle.position = Vector2(18.0, 42.0)
	selected_subtitle.size = Vector2(250.0, 44.0)
	selected_subtitle.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	panel.add_child(selected_subtitle)

	action_button = Button.new()
	action_button.position = Vector2(18.0, 82.0)
	action_button.size = Vector2(250.0, 28.0)
	action_button.text = "Concentrer la Mana +%s" % _format_amount(MANA_PER_CLICK)
	action_button.add_theme_font_size_override("font_size", 12)
	action_button.pressed.connect(_on_action_button_pressed)
	panel.add_child(action_button)

func _render_ritual_panel() -> void:
	var seal := _current_seal()
	if seal.is_empty():
		ritual_title.text = "Tous les sceaux"
		ritual_subtitle.text = "la bibliotheque est ouverte"
		ritual_button.text = "Pret"
		ritual_button.disabled = true
		_clear_children(requirements_box)
		return

	var book := _book_by_id(str(seal.get("unlocksBookId", "")))
	ritual_title.text = "Sceau %s" % _roman(int(seal.get("level", 1)))
	ritual_subtitle.text = "Ouvre %s" % str(book.get("name", "un livre"))
	ritual_button.text = "Briser le sceau" if _can_unlock_seal(seal) else "Offrir"
	ritual_button.disabled = false

	_clear_children(requirements_box)
	for requirement in seal.get("requirements", []):
		var row := _requirement_row(requirement)
		requirements_box.add_child(row)

func _requirement_row(requirement: Dictionary) -> Control:
	var resource_id := str(requirement.get("id", "mana"))
	var amount := int(requirement.get("amount", 0))
	var stock := _resource_stock(resource_id)
	var row := HBoxContainer.new()
	row.custom_minimum_size = Vector2(0.0, 28.0)
	row.add_theme_constant_override("separation", 8)

	var icon := TextureRect.new()
	icon.custom_minimum_size = Vector2(24.0, 24.0)
	icon.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	icon.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	var path := "res://assets/library/resources/%s.svg" % resource_id
	if ResourceLoader.exists(path):
		icon.texture = load(path)
	row.add_child(icon)

	var label := _make_label("%s  %s / %s" % [RESOURCE_LABELS.get(resource_id, resource_id), _format_amount(stock), _format_amount(amount)], 12, Color(0.95, 0.86, 0.68, 1.0), HORIZONTAL_ALIGNMENT_LEFT)
	label.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	row.add_child(label)

	return row

func _on_action_button_pressed() -> void:
	state.gain_mana(MANA_PER_CLICK)
	_sync_ui()

func _on_ritual_button_pressed() -> void:
	var seal := _current_seal()
	if seal.is_empty():
		return
	var book := _book_by_id(str(seal.get("unlocksBookId", "")))
	if state.try_unlock_book(book):
		state.selected_book_id = str(book.get("id", "mana"))
	_sync_ui()

func _on_book_gui_input(event: InputEvent, book: Dictionary) -> void:
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
		var book_id := str(book.get("id", ""))
		state.selected_book_id = book_id
		if state.is_book_unlocked(book_id):
			_open_book_page(book)
			_sync_ui()
			return
		_sync_ui()

func _open_book_page(book: Dictionary) -> void:
	_close_book_page()
	active_book_page = BookPageScene.instantiate()
	active_book_page.size = Vector2(620.0, 420.0)
	active_book_page.position = (get_viewport_rect().size - active_book_page.size) * 0.5
	page_layer.add_child(active_book_page)
	active_book_page.setup(book, state)
	active_book_page.close_requested.connect(_close_book_page)
	active_book_page.state_changed.connect(_sync_ui)

func _close_book_page() -> void:
	if active_book_page == null:
		return
	active_book_page.queue_free()
	active_book_page = null
	_sync_ui()

func _current_seal() -> Dictionary:
	var selected_book := _book_by_id(state.selected_book_id)
	if not selected_book.is_empty() and not state.is_book_unlocked(state.selected_book_id):
		for seal in seals:
			if str(seal.get("unlocksBookId", "")) == state.selected_book_id:
				return seal
	for seal in seals:
		var book_id := str(seal.get("unlocksBookId", ""))
		if not state.is_book_unlocked(book_id):
			return seal
	return {}

func _can_unlock_seal(seal: Dictionary) -> bool:
	for requirement in seal.get("requirements", []):
		if _resource_stock(str(requirement.get("id", "mana"))) < int(requirement.get("amount", 0)):
			return false
	return true

func _selected_book() -> Dictionary:
	var selected := _book_by_id(state.selected_book_id)
	if selected.is_empty():
		return _book_by_id("mana")
	return selected

func _book_by_id(book_id: String) -> Dictionary:
	for book in books:
		if str(book.get("id", "")) == book_id:
			return book
	return {}

func _book_resource_stock(book: Dictionary) -> int:
	var resource_id := str(book.get("resourceId", "mana"))
	if resource_id == "mana":
		return state.mana
	return int(state.resources.get(resource_id, 0))

func _resource_stock(resource_id: String) -> int:
	if resource_id == "mana":
		return state.mana
	return int(state.resources.get(resource_id, 0))

func _make_panel(center: Vector2, panel_size: Vector2, fill: Color, border: Color, radius := 8, border_width := 1) -> Panel:
	var panel := Panel.new()
	panel.position = center - (panel_size * 0.5)
	panel.size = panel_size
	panel.add_theme_stylebox_override("panel", _stylebox(fill, border, radius, border_width))
	return panel

func _make_label(text: String, font_size: int, color: Color, alignment: HorizontalAlignment) -> Label:
	var label := Label.new()
	label.text = text
	label.horizontal_alignment = alignment
	label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	label.add_theme_color_override("font_color", color)
	label.add_theme_font_size_override("font_size", font_size)
	label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return label

func _stylebox(fill: Color, border: Color, radius: int, border_width: int) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = fill
	style.border_color = border
	style.border_width_left = border_width
	style.border_width_top = border_width
	style.border_width_right = border_width
	style.border_width_bottom = border_width
	style.corner_radius_top_left = radius
	style.corner_radius_top_right = radius
	style.corner_radius_bottom_left = radius
	style.corner_radius_bottom_right = radius
	return style

func _fill_parent(control: Control, offset_start: Vector2, offset_end: Vector2) -> void:
	control.set_anchors_preset(Control.PRESET_FULL_RECT)
	control.offset_left = offset_start.x
	control.offset_top = offset_start.y
	control.offset_right = offset_end.x
	control.offset_bottom = offset_end.y

func _clear_children(node: Node) -> void:
	for child in node.get_children():
		child.queue_free()

func _roman(value: int) -> String:
	match value:
		1:
			return "I"
		2:
			return "II"
		3:
			return "III"
		4:
			return "IV"
		5:
			return "V"
		6:
			return "VI"
		7:
			return "VII"
		8:
			return "VIII"
		9:
			return "IX"
	return str(value)

func _format_amount(value: Variant) -> String:
	return str(int(round(float(value))))

func _load_json_array(resource_path: String) -> Array:
	var file := FileAccess.open(resource_path, FileAccess.READ)
	if file == null:
		push_error("Missing Godot import data: %s" % resource_path)
		return []

	var parsed = JSON.parse_string(file.get_as_text())
	if typeof(parsed) != TYPE_ARRAY:
		push_error("Expected JSON array at %s" % resource_path)
		return []
	return parsed
