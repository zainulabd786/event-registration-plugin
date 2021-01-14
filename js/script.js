jQuery(document).ready(function ($) {
  $(document).on("click", ".toggler", function () {
    $(this).toggleClass("active");
    $(this).parent().next().slideToggle();
  });

  $("#team_size").change((e) => {
    const numberOfParticipants = parseInt(e.target.value) || 1;
    renderMarkup(numberOfParticipants);
  });
  renderMarkup();

  $("#password, #confirm_password").keyup(() => {
    let password = $("#password").val();
    let confirm_password = $("#confirm_password").val();
    if (password !== confirm_password)
      $("#poto_register").attr("disabled", true);
    else $("#poto_register").attr("disabled", false);
  });

  jQuery("#your-profile").attr("enctype", "multipart/form-data");
  jQuery("#your-profile").attr("encoding", "multipart/form-data");

  const docs_to_delete = [];
  $(".poto_remove_doc").click((e) => {
    const attach_id = e.target.getAttribute("data-id");
    docs_to_delete.push(attach_id);
    $("#docs_to_delete").val(docs_to_delete.join(","));
    $(`#doc_${attach_id}`).remove();
  });
});

const renderMarkup = (numberOfParticipants = 1) => {
  let markup = "";
  for (let i = 0; i < numberOfParticipants; i++) {
    markup += renderParticipatForm(i);
  }
  jQuery("#participants_details").html(markup);
};

const renderParticipatForm = (id) => `
    <div class="cm__participant__title">
        <p>Participant ${id + 1}</p>
        <span class="toggler"></span>
    </div>
    <div class="participant-form">
        <div class="field__group_3">
        <div class="cm__input__feild">
            <label class="cm__feild__label">Participant Name</label>
            <input class="cm__input" type="text" name="participant_name_${id}" id="participant_name_${id}" required/>
        </div>
        
        <div class="cm__input__feild">
            <label class="cm__feild__label">Participant profession</label>
            <select class="cm__input" name="participant_profession_${id}" id="participant_profession_${id}" required>
                <option value="">Please select</option>
                <option value="studying">Currently studying</option>
                <option value="passed">Passed out of college</option>
                <option value="dropout">College drop out</option>
            </select>
        </div>

        <div class="cm__input__feild">
			<label class="cm__feild__label">Participant DOB</label>
            <input class="cm__input" type="date" name="participant_dob_${id}" id="participant_dob_${id}" required/>
        </div>
        </div>
        
        <div class="field__group_3">
        <div class="cm__input__feild">
            <label class="cm__feild__label">College Name</label>
            <input class="cm__input" type="text" name="college_name_${id}" id="college_name_${id}" required/>
        </div>
        <div class="cm__input__feild">
            <label class="cm__feild__label">Degree</label>
            <select class="cm__input" name="degree_${id}" id="degree_${id}" required>
                <option value="">Please select</option>
                <option value="bachelor’s">Bachelor’s </option>
                <option value="master">Master’s </option>
                <option value="diploma">Diploma</option>  
            </select>
        </div>
        <div class="cm__input__feild">
        <label class="cm__feild__label">Mode of Study</label>        
        <select class="cm__input" name="mode_of_study_${id} id="mode_of_study_${id}" required>
            <option value="">Please select</option>
            <option value="fulltime">Full-time</option>
            <option value="parttime">Part-time</option>
            <option value="distancelearning">Distance learning</option>
        </select>
        </div>
        </div>
        
        <div class="field__group_3">
        <div class="cm__input__feild">
        <label class="cm__feild__label">Graduation Date</label>
        <input class="cm__input" type="date" name="graduation_date_${id}" id="graduation_date_${id}" required/></div>
        
        <div class="cm__input__feild">
        <label class="cm__feild__label">Participant's Email</label>
        <input class="cm__input" type="text" name="participant_email_${id}" id="participant_email_${id}" required/></div>
        
        <div class="cm__input__feild">
        <label class="cm__feild__label">College ID Card</label>
        <input class="cm__input" type="file" name="college_id_card_${id}" id="college_id_card_${id}" required/></div>
        </div>

        <div class="field__group_3">
        <div class="cm__input__feild">
        <label class="cm__feild__label">Gov issued Photo ID card</label>
        <input class="cm__input" type="file" name="photo_id_card_${id}" id="photo_id_card_${id}" required/></div>

        <div class="cm__input__feild">
        <label class="cm__feild__label">Participant's contact number</label>
<div class="cm__input__feild__number__wrap">
		<span class="cm__input__contact">+91</span>
        <input class="cm__input cm__input__contact__number" type="text" name="participant_contact_number_${id}" id="participant_contact_number_${id}" required/></div></div>

        <div class="cm__input__feild">
        <label class="cm__feild__label">Participants City</label>
        <input class="cm__input" type="text" name="participants_city_${id}" id="participants_city_${id}" required/></div>
        </div>
        
        <div class="field__group_3">
        <div class="cm__input__feild">
        <label class="cm__feild__label">Participants Nationality</label>
        <input class="cm__input" type="text" name="participants_nationality_${id}" id="participants_nationality_${id}" required/></div>

        <div class="cm__input__feild">
        <label class="cm__feild__label">Gender</label>
        <select class="cm__input" name="gender_${id} id="gender_${id}" required>
            <option value="">Please select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="prefer not to disclose">Prefer not to disclose</option>
        </select></div>
        </div>
    </div>
`;
