extends PanelContainer

signal close_requested
signal state_changed

var book: Dictionary = {}
var game_state: LibraryMagicGameState

@onready var title_label: Label = %TitleLabel
@onready var subtitle_label: Label = %SubtitleLabel
@onready var stats_label: Label = %StatsLabel
@onready var content_label: Label = %ContentLabel
@onready var feedback_label: Label = %FeedbackLabel
@onready var action_button: Button = %ActionButton
@onready var close_button: Button = %CloseButton

func _ready() -> void:
	_ensure_nodes()
	action_button.pressed.connect(_on_action_pressed)
	close_button.pressed.connect(func() -> void:
		close_requested.emit()
	)

func setup(next_book: Dictionary, next_state: LibraryMagicGameState) -> void:
	book = next_book
	game_state = next_state
	_ensure_nodes()
	_render()

func _render() -> void:
	_ensure_nodes()
	var book_id := str(book.get("id", ""))
	title_label.text = str(book.get("name", "Livre"))
	subtitle_label.text = str(book.get("subtitle", ""))
	content_label.text = _content_for_book(book_id)
	action_button.text = _action_label_for_book(book_id)
	feedback_label.text = _last_run_summary(book_id)
	stats_label.text = _stats_text()

func _on_action_pressed() -> void:
	_ensure_nodes()
	if game_state == null:
		return
	var result := game_state.perform_book_action(book)
	feedback_label.text = str(result.get("message", "Action terminee"))
	stats_label.text = _stats_text()
	state_changed.emit()

func _stats_text() -> String:
	if game_state == null:
		return ""
	var resource_id := str(book.get("resourceId", "mana"))
	var resource_name := str(book.get("resourceName", "Mana"))
	if resource_id == "mana":
		return "Mana disponible: %s" % _format_amount(game_state.mana)
	return "%s: %s   Mana: %s" % [resource_name, _format_amount(game_state.resource_stock(resource_id)), _format_amount(game_state.mana)]

func _ensure_nodes() -> void:
	if title_label == null:
		title_label = get_node("%TitleLabel")
	if subtitle_label == null:
		subtitle_label = get_node("%SubtitleLabel")
	if stats_label == null:
		stats_label = get_node("%StatsLabel")
	if content_label == null:
		content_label = get_node("%ContentLabel")
	if feedback_label == null:
		feedback_label = get_node("%FeedbackLabel")
	if action_button == null:
		action_button = get_node("%ActionButton")
	if close_button == null:
		close_button = get_node("%CloseButton")

func _last_run_summary(book_id: String) -> String:
	if game_state == null:
		return "Pret"
	var run_state: Dictionary = game_state.book_runs.get(book_id, {})
	if run_state.is_empty():
		return "Pret"
	var parts: Array[String] = []
	for key in run_state.keys():
		parts.append("%s %s" % [str(key), _format_amount(run_state[key])])
	return "Progression: %s" % ", ".join(parts)

func _action_label_for_book(book_id: String) -> String:
	match book_id:
		"mana":
			return "Concentrer la Mana"
		"serpent":
			return "Ramasser un orbe"
		"typing":
			return "Completer un mot"
		"herbarium":
			return "Cultiver les spores"
		"defense":
			return "Repousser une vague"
		"blackjack":
			return "Resoudre une main"
		"hundred":
			return "Tirer un nombre"
		"mine":
			return "Casser un bloc"
		"targets":
			return "Toucher une cible"
		"slimeTrainer":
			return "Lancer un duel"
	return "Agir"

func _content_for_book(book_id: String) -> String:
	match book_id:
		"mana":
			return "La premiere Book Page du port Godot. Concentre la Mana pour nourrir les prochains Unlocks."
		"serpent":
			return "Un serpent simple ramasse des orbes. Cette premiere tranche produit Ecailles et un peu de Mana."
		"typing":
			return "Arc Typing recompense les mots parfaits. La version Godot complete viendra avec saisie clavier directe."
		"herbarium":
			return "Herbier Enchante donne une production calme et progressive de Spores."
		"defense":
			return "Bastion Arcanique represente la boucle de vague: une action repousse une vague et grave des Sceaux."
		"blackjack":
			return "Table du Blackjack resout une main courte pour produire des Jetons."
		"hundred":
			return "Calcul du Cent accumule des tirages. Atteindre 100 donne une grosse recompense de Fragments."
		"mine":
			return "Mine des Profondeurs casse des Blocs de mine et transforme l'effort en Pieces de mine."
		"targets":
			return "Galerie des Cibles recompense les tirs precis avec des Marques."
		"slimeTrainer":
			return "Slime Trainer lance des duels courts et donne des Gels de victoire."
	return "Page en construction"

func _format_amount(value: Variant) -> String:
	return str(int(round(float(value))))
