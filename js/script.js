jQuery(document).ready(function ($) {
  $("#your-profile").attr("enctype", "multipart/form-data");
  $("#your-profile").attr("encoding", "multipart/form-data");
  renderMarkup();

  $(document).on("click", ".toggler", function () {
    $(this).toggleClass("active");
    $(this).parent().next().slideToggle();
  });

  $(document).on("change", ".dob", function () {
    const birthday = $(this).val();
    console.log("birthday", birthday);
    console.log("underAgeValidate(birthday)", underAgeValidate(birthday));
    const id = $(this).data("id");
    if (underAgeValidate(birthday)) {
      $(`#dob_err_${id}`).html("Age cannot be less than 18");
    } else {
      $(`#dob_err_${id}`).html("");
    }
  });

  $("#team_size").change((e) => {
    const numberOfParticipants = parseInt(e.target.value) || 1;
    renderMarkup(numberOfParticipants);
  });

  $("#password, #confirm_password").keyup(() => {
    let password = $("#password").val();
    let confirm_password = $("#confirm_password").val();
    if (password !== confirm_password)
      $("#poto_register").attr("disabled", true);
    else $("#poto_register").attr("disabled", false);
  });

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

function underAgeValidate(birthday) {
  // it will accept two types of format yyyy-mm-dd and yyyy/mm/dd
  var optimizedBirthday = birthday.replace(/-/g, "/");

  //set date based on birthday at 01:00:00 hours GMT+0100 (CET)
  var myBirthday = new Date(optimizedBirthday);

  // set current day on 01:00:00 hours GMT+0100 (CET)
  var currentDate = new Date().toJSON().slice(0, 10) + " 01:00:00";

  // calculate age comparing current date and borthday
  var myAge = ~~((Date.now(currentDate) - myBirthday) / 31557600000);

  if (myAge < 18) {
    return true;
  } else {
    return false;
  }
}

const renderParticipatForm = (id) => `
    <div class="cm__participant__title">
        <p>Participant ${id + 1}</p>
        <span class="toggler"></span>
    </div>
    <div class="participant-form">
        <div class="field__group_3">
        <div class="cm__input__feild">
            <label class="cm__feild__label">Name</label>
            <input class="cm__input" type="text" name="participant_name_${id}" id="participant_name_${id}" required/>
        </div>
        
        <div class="cm__input__feild">
            <label class="cm__feild__label">Education Status</label>
            <select class="cm__input" name="participant_profession_${id}" id="participant_profession_${id}" required>
                <option value="">Please select</option>
                <option value="studying">Currently studying</option>
                <option value="passed">Passed out of college</option>
                <option value="dropout">College drop out</option>
            </select>
        </div>

        <div class="cm__input__feild">
			<label class="cm__feild__label">DOB</label>
            <input class="cm__input dob" type="date" name="participant_dob_${id}" id="participant_dob_${id}" data-id="${id}" required/>
            <div class="error" id="dob_err_${id}"></div>
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
        <label class="cm__feild__label">Email</label>
        <input class="cm__input" type="text" name="participant_email_${id}" id="participant_email_${id}" required/></div>
        
        <div class="cm__input__feild">
        <label class="cm__feild__label">College ID Card</label>
        <input class="cm__input" type="file" name="college_id_card_${id}" id="college_id_card_${id}" required/></div>
        </div>

        <div class="field__group_3">
        <div class="cm__input__feild">
        <label class="cm__feild__label">Gov Issued Photo ID Card</label>
        <input class="cm__input" type="file" name="photo_id_card_${id}" id="photo_id_card_${id}" required/></div>

        <div class="cm__input__feild">
        <label class="cm__feild__label">Contact Number</label>
<div class="cm__input__feild__number__wrap">
		<span class="cm__input__contact">+91</span>
        <input class="cm__input cm__input__contact__number" pattern="[789][0-9]{9}" title="Please enter a valid 10 digit mobile number" type="text" name="participant_contact_number_${id}" id="participant_contact_number_${id}" required/></div></div>

        <div class="cm__input__feild">
        <label class="cm__feild__label">City</label>
        <input class="cm__input" type="text" name="participants_city_${id}" id="participants_city_${id}" required/></div>
        </div>
        
        <div class="field__group_3">
        <div class="cm__input__feild">
        <label class="cm__feild__label">Nationality</label>
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
