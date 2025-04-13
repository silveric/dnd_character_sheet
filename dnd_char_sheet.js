const localStorageID_lastCharID = "dnd_char_lastCharID";
const localStorageID_charactersDatas = "dnd_char_charactersDatas";

let currentCharID;
let currentCharData;

function init(){
	const lastCharID = getLastSavedCharID();
	const lastChar = getLastSavedChar();
	
	if(lastCharID && lastChar ){
		//Go Load
		currentCharID = lastCharID;
		currentCharData = lastChar;
	}else{
		currentCharID = generateRanCharID();
		currentCharData = {};
	}


	
	console.log("INIT");
	console.log(currentCharID);
	console.log(currentCharData);
	console.log("END-INIT");

	init_modals();
	displayCharacterInfos();
}


jQuery(document).on("click","#basic_infos_modal_save_btn",function() {
	const val_name = jQuery("#basic_info_input_name").val();
	const val_background = jQuery("#basic_info_input_background").val();
	const val_class = jQuery("#basic_info_input_class").val();
	const val_subclass = jQuery("#basic_info_input_subclass").val();
	const val_species = jQuery("#basic_info_input_species").val();

	saveStat("basicInfo_name",val_name);
	saveStat("basicInfo_background",val_background);
	saveStat("basicInfo_class",val_class);
	saveStat("basicInfo_subclass",val_subclass);
	saveStat("basicInfo_species",val_species);

	displayCharacterInfos();

	jQuery("#basic_infos_modal").hide();
});

function getStat(statName){
	if(typeof currentCharData === "object" && typeof currentCharData[statName] !== "undefined" ){
		return currentCharData[statName];
	}
	return null;
}

function saveStat(statHandle,statVal){
	currentCharData[statHandle] = statVal;
	let charactersDatas = JSON.parse(localStorage.getItem(localStorageID_charactersDatas));
	if(!charactersDatas){charactersDatas = {};}
	charactersDatas[currentCharID] = currentCharData;
	localStorage.setItem(localStorageID_charactersDatas, JSON.stringify(charactersDatas));
	localStorage.setItem(localStorageID_lastCharID, currentCharID);
	return true;
}

function getLastSavedCharID(){
	return localStorage.getItem(localStorageID_lastCharID);
}

function getLastSavedChar(){
	const lastCharID = getLastSavedCharID();
	if(lastCharID){
		return loadCharDatas(lastCharID);
	}
	return null;
}

function loadCharDatas(charID){
	const charactersDatas = JSON.parse(localStorage.getItem(localStorageID_charactersDatas));
	if(charactersDatas && typeof charactersDatas === "object"){
		return charactersDatas[charID];
	}
	return null;
}

function generateRanCharID(security = 0){
	if(security > 50){return false;}
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < 10; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	//Checking if that ID isn't already taken
	let charactersDatas = JSON.parse(localStorage.getItem(localStorageID_charactersDatas));
	if(charactersDatas[result]){
		return generateRanCharID(security++);
	}

	return result;
}

function nukeCharDatas(){
	localStorage.removeItem(localStorageID_lastCharID);
	localStorage.removeItem(localStorageID_charactersDatas);
}

/**
 * Master display function that will just show all fields necessaries in HTML from the character datas (in currentCharData).
 */
function displayCharacterInfos(){

	jQuery("#character_id_display").html(currentCharID);
	if(!currentCharData){return false;}

	//Basic infos
	jQuery("#char_name").html(getStat("basicInfo_name") ?? jQuery("#char_name").attr("data-default_val"));
	jQuery("#char_background").html(getStat("basicInfo_background") ?? jQuery("#char_background").attr("data-default_val"));
	jQuery("#char_class").html(getStat("basicInfo_class") ?? jQuery("#char_class").attr("data-default_val"));
	jQuery("#char_subclass").html(getStat("basicInfo_subclass") ?? jQuery("#char_subclass").attr("data-default_val"));
	jQuery("#char_species").html(getStat("basicInfo_species") ?? jQuery("#char_species").attr("data-default_val"));

	//Level
	jQuery("#lvl_value").html(currentCharData["lvl_value"] ?? jQuery("#lvl_value").attr("data-default_val"));
	jQuery("#exp_value").html(currentCharData["exp_value"] ?? jQuery("#exp_value").attr("data-default_val"));

	//Armor / Shield
	jQuery("#armor_class").html(currentCharData["armor_class"] ?? jQuery("#armor_class").attr("data-default_val"));
	jQuery("#has_shield").prop("checked",!!getStat("has_shield"));
	/*if(currentCharData["has_shield"]){
		jQuery("#has_shield").prop("checked",true);
	}*/

}

/**
 * Initialize all modals
 */
function init_modals(){
	init_modal_characters_storage_datas();
	init_modal_basic_infos();
	init_modal_level_xp();
	init_modal_armor_class_shield();
}

function init_modal_basic_infos(){
	jQuery("#basic_info_input_name").val(getStat("basicInfo_name") ?? "");
	jQuery("#basic_info_input_background").val(getStat("basicInfo_background") ?? "");
	jQuery("#basic_info_input_class").val(getStat("basicInfo_class") ?? "");
	jQuery("#basic_info_input_subclass").val(getStat("basicInfo_subclass") ?? "");
	jQuery("#basic_info_input_species").val(getStat("basicInfo_species") ?? "");
}



/**
 * Level and XP
 */
function init_modal_level_xp(){
	jQuery("#level_input_level").val(getStat("lvl_value") ?? "");
	jQuery("#level_input_xp").val(getStat("exp_value") ?? "");
}
jQuery(document).on("click","#level_modal_level_down",function() {
	let levelInputDOM = jQuery("#level_input_level");
	let currentLevel = parseInt(levelInputDOM.val());
	if(isNaN(currentLevel) || currentLevel <= 1){
		levelInputDOM.val(0);return true;
	}else{
		levelInputDOM.val(currentLevel - 1);return true;
	}
});

jQuery(document).on("click","#level_modal_level_up",function() {
	let levelInputDOM = jQuery("#level_input_level");
	let currentLevel = parseInt(levelInputDOM.val());
	if(isNaN(currentLevel) || currentLevel < 0){
		levelInputDOM.val(0);return true;
	}else{
		levelInputDOM.val(currentLevel + 1);return true;
	}
});

jQuery(document).on("click","#level_modal_save_btn",function() {
	let val_lvl = jQuery("#level_input_level").val();
	let val_xp = jQuery("#level_input_xp").val();

	saveStat("lvl_value",val_lvl);
	saveStat("exp_value",val_xp);

	displayCharacterInfos();

	jQuery("#level-modal").hide();

});

/**
 * Armor Class / Shield
 */
function init_modal_armor_class_shield(){
	jQuery("#armor_class_input").val(getStat("armor_class") ?? "");
	jQuery("#has_shield_input").prop("checked",!!getStat("has_shield"));
	return true;
}

jQuery(document).on("click","#armor_class_modal_save_btn",function() {
	const armorClass = jQuery("#armor_class_input").val(  );
	const hasShield = jQuery("#has_shield_input").prop( "checked" );

	saveStat("armor_class",armorClass);
	saveStat("has_shield",hasShield);

	displayCharacterInfos();
	jQuery("#armor_class_modal").hide();

	return true;
});





function init_modal_characters_storage_datas(){
	jQuery("#modal_characters_data_characters_list").empty();

	//Getting characters in storage and creating new .modal_characters_data_character_elt in the characters datas modal
	const charactersDatas = JSON.parse(localStorage.getItem(localStorageID_charactersDatas));
	console.log(charactersDatas);

	if(typeof charactersDatas !== "undefined"){
		for (let key in charactersDatas) {
			const character = charactersDatas[key];
			const characterID = key;

			const characterEltDOM = jQuery("#hidden_elts .modal_characters_data_character_elt").clone();
			characterEltDOM.attr("data-char_id",characterID);

			characterEltDOM.find(".modal_characters_data_character_elt_name").html(character["basicInfo_name"] ??
				characterEltDOM.find(".modal_characters_data_character_elt_name").attr("data-default_val"));

			characterEltDOM.find(".modal_characters_data_character_elt_class").html(character["basicInfo_class"] ??
				characterEltDOM.find(".modal_characters_data_character_elt_class").attr("data-default_val"));

			characterEltDOM.find(".modal_characters_data_character_elt_lvl").html("["+character["lvl_value"]+"]" ??
				characterEltDOM.find(".modal_characters_data_character_elt_lvl").attr("data-default_val"));

			characterEltDOM.find(".modal_characters_data_character_elt_species").html(character["basicInfo_species"] ??
				characterEltDOM.find(".modal_characters_data_character_elt_species").attr("data-default_val"));

			jQuery("#modal_characters_data_characters_list").append(characterEltDOM);
		}
	}

	jQuery(document).on("click",".modal_characters_data_character_elt_actions_load",function() {
		const char_elt_DOM = jQuery(this).parents(".modal_characters_data_character_elt");
		const characterID = char_elt_DOM.attr("data-char_id");

		localStorage.setItem(localStorageID_lastCharID, characterID);
		location.reload();
	});

	jQuery(document).on("click",".modal_characters_data_character_elt_actions_delete",function() {
		const char_elt_DOM = jQuery(this).parents(".modal_characters_data_character_elt");
		const characterID = char_elt_DOM.attr("data-char_id");

		let resConfirm = confirm("Are you sure? This will delete the character.");
		if(!resConfirm){return false;}

		if(characterID === currentCharID){
			localStorage.removeItem(localStorageID_lastCharID);
		}
		//Deleting character from the localstorage
		let charactersDatas = JSON.parse(localStorage.getItem(localStorageID_charactersDatas));
		if(!charactersDatas){charactersDatas = {};}
		delete charactersDatas[currentCharID];
		localStorage.setItem(localStorageID_charactersDatas, JSON.stringify(charactersDatas));
		location.reload();
	});

	jQuery(document).on("click","#action_create_new_character",function() {
		const newCharID = generateRanCharID();
		let charactersDatas = JSON.parse(localStorage.getItem(localStorageID_charactersDatas));
		charactersDatas[newCharID] = {};

		localStorage.setItem(localStorageID_charactersDatas, JSON.stringify(charactersDatas));
		localStorage.setItem(localStorageID_lastCharID, newCharID);
		location.reload();
	});

	jQuery(document).on("click","#action_nuke_datas",function() {
		let resConfirm = confirm("Are you sure? This will delete everything.");
		if(resConfirm){
			nukeCharDatas();
			location.reload();
		}
	});
}

jQuery(document).on("click",".modal_close",function() {
	const parentModalDOM = jQuery(this).parents(".modal");
	parentModalDOM.hide();
});

function openModal(id) {
  document.getElementById(id).style.display = 'flex';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

// Close on outside click
window.onclick = function(event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
	if (event.target === modal) {
	  modal.style.display = 'none';
	}
  });
}

jQuery(document).ready(function(){
	init();
});