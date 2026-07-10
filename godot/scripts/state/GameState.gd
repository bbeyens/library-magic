extends RefCounted
class_name LibraryMagicGameState

var mana: int = 0
var keys: int = 0
var resources: Dictionary = {}
var unlocked_books: Dictionary = {"mana": true}
var selected_book_id: String = "mana"
var book_runs: Dictionary = {}

func gain_mana(amount: int) -> void:
	mana += amount

func add_resource(resource_id: String, amount: int) -> void:
	if resource_id == "mana":
		gain_mana(amount)
		return
	resources[resource_id] = int(resources.get(resource_id, 0)) + amount

func resource_stock(resource_id: String) -> int:
	if resource_id == "mana":
		return mana
	return int(resources.get(resource_id, 0))

func is_book_unlocked(book_id: String) -> bool:
	return bool(unlocked_books.get(book_id, false))

func try_unlock_book(book: Dictionary) -> bool:
	var book_id := str(book.get("id", ""))
	if is_book_unlocked(book_id):
		return true

	var unlock_mana := int(book.get("unlockMana", 0))
	if mana < unlock_mana:
		return false

	var unlock_resource: Dictionary = book.get("unlockResource", {})
	if not unlock_resource.is_empty():
		var resource_id := str(unlock_resource.get("id", ""))
		var amount := int(unlock_resource.get("amount", 0))
		if int(resources.get(resource_id, 0)) < amount:
			return false
		resources[resource_id] = int(resources.get(resource_id, 0)) - amount

	mana -= unlock_mana
	unlocked_books[book_id] = true
	return true

func perform_book_action(book: Dictionary) -> Dictionary:
	var book_id := str(book.get("id", ""))
	var run_state: Dictionary = book_runs.get(book_id, {})
	var resource_id := str(book.get("resourceId", "mana"))
	var resource_name := str(book.get("resourceName", "Mana"))
	var reward := 1
	var message := ""

	match book_id:
		"mana":
			reward = 12 + int(run_state.get("focus", 0))
			run_state["focus"] = int(run_state.get("focus", 0)) + 1
			add_resource("mana", reward)
			message = "Mana concentree +%s" % reward
		"serpent":
			reward = 1 + int(run_state.get("combo", 0)) / 5
			run_state["combo"] = int(run_state.get("combo", 0)) + 1
			add_resource(resource_id, reward)
			add_resource("mana", 1)
			message = "Orbe ramassee: +%s %s" % [reward, resource_name]
		"typing":
			reward = 2
			run_state["words"] = int(run_state.get("words", 0)) + 1
			add_resource(resource_id, reward)
			message = "Mot parfait: +%s %s" % [reward, resource_name]
		"herbarium":
			reward = 2 + int(run_state.get("growth", 0)) / 4
			run_state["growth"] = int(run_state.get("growth", 0)) + 1
			add_resource(resource_id, reward)
			message = "Recolte douce: +%s %s" % [reward, resource_name]
		"defense":
			reward = 3
			run_state["wave"] = int(run_state.get("wave", 1)) + 1
			add_resource(resource_id, reward)
			message = "Vague repoussee: +%s %s" % [reward, resource_name]
		"blackjack":
			reward = 5
			run_state["hands"] = int(run_state.get("hands", 0)) + 1
			add_resource(resource_id, reward)
			message = "Main resolue: +%s %s" % [reward, resource_name]
		"hundred":
			var total := int(run_state.get("total", 0))
			var roll := 10 + ((total / 10) % 5) * 3
			total += roll
			if total >= 100:
				reward = 8
				total = 0
				message = "Cent atteint: +%s %s" % [reward, resource_name]
			else:
				reward = 1
				message = "Tirage %s, total %s: +%s %s" % [roll, total, reward, resource_name]
			run_state["total"] = total
			add_resource(resource_id, reward)
		"mine":
			reward = 2
			run_state["blocks"] = int(run_state.get("blocks", 0)) + 1
			add_resource(resource_id, reward)
			message = "Bloc casse: +%s %s" % [reward, resource_name]
		"targets":
			reward = 2
			run_state["hits"] = int(run_state.get("hits", 0)) + 1
			add_resource(resource_id, reward)
			message = "Cible touchee: +%s %s" % [reward, resource_name]
		"slimeTrainer":
			reward = 2
			run_state["victories"] = int(run_state.get("victories", 0)) + 1
			add_resource(resource_id, reward)
			message = "Duel gagne: +%s %s" % [reward, resource_name]
		_:
			add_resource(resource_id, reward)
			message = "+%s %s" % [reward, resource_name]

	book_runs[book_id] = run_state
	return {
		"message": message,
		"resource_id": resource_id,
		"reward": reward,
		"stock": resource_stock(resource_id),
		"run_state": run_state,
	}
