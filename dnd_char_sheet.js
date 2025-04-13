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

	display_basicInfos();

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

function generateRanCharID(){
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < 10; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
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

	display_basicInfos();

}

function display_basicInfos(){
	if(!currentCharData){return null;}
	jQuery("#char_name").html(getStat("basicInfo_name") ?? jQuery("#char_name").attr("data-default_val"));
	jQuery("#char_background").html(getStat("basicInfo_background") ?? jQuery("#char_background").attr("data-default_val"));
	jQuery("#char_class").html(getStat("basicInfo_class") ?? jQuery("#char_class").attr("data-default_val"));
	jQuery("#char_subclass").html(getStat("basicInfo_subclass") ?? jQuery("#char_subclass").attr("data-default_val"));
	jQuery("#char_species").html(getStat("basicInfo_species") ?? jQuery("#char_species").attr("data-default_val"));

	jQuery("#basic_info_input_name").val(getStat("basicInfo_name") ?? "");
	jQuery("#basic_info_input_background").val(getStat("basicInfo_background") ?? "");
	jQuery("#basic_info_input_class").val(getStat("basicInfo_class") ?? "");
	jQuery("#basic_info_input_subclass").val(getStat("basicInfo_subclass") ?? "");
	jQuery("#basic_info_input_species").val(getStat("basicInfo_species") ?? "");
}

jQuery(document).on("click","#action_nuke_datas",function() {
	let resConfirm = confirm("Are you sure? This will delete everything.");
	if(resConfirm){
		nukeCharDatas();
		location.reload();
	}
});

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