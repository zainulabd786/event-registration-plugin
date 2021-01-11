jQuery(document).ready(function ($) {
 
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
       $(`#doc_${attach_id}`).remove()
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
    <div class="participant-form">
        <div>
            <input type="text" name="participant_name_${id}" id="participant_name_${id}" placeholder="Participant Name" />
            <select name="participant_profession_${id}" id="participant_profession_${id}" >
                <option>Participant Profession</option>
                <option value="self-employed">self Employed</option>
                <option value="other">Other</option>
            </select>
            <input type="date" name="participant_dob_${id}" id="participant_dob_${id}" placeholder="Participant DOB" />
        </div>
        
        <div>
            <input type="text" name="college_name_${id}" id="college_name_${id}" placeholder="College Name" />
            <select name="degree_${id}" id="degree_${id}" >
                <option>Degree</option>
                <option value="mba">MBA</option>
                <option value="mca">MCA</option>
            </select>
            <input type="text" name="mode_of_study_${id}" id="mode_of_study_${id}" placeholder="Mode of Study" />
        </div>
        
        <div>
            <input type="date" name="graduation_date_${id}" id="graduation_date_${id}" placeholder="Graduation Date" />
            <input type="text" name="participant_email_${id}" id="participant_email_${id}" placeholder="Participant's Email" />
            <input type="file" name="college_id_card_${id}" id="college_id_card_${id}" placeholder="College ID Card" />
        </div>

        <div>
            <input type="file" name="photo_id_card_${id}" id="photo_id_card_${id}" placeholder="Photo ID Card" />
            <input type="text" name="participant_contact_number_${id}" id="participant_contact_number_${id}" placeholder="Participant's contact number" />
            <input type="text" name="participants_city_${id}" id="participants_city_${id}" placeholder="Participants City" />
        </div>
        
        <div>
            <input type="text" name="participants_nationality_${id}" id="participants_nationality_${id}" placeholder="Participants Nationality" />
            <select name="gender_${id} id="gender_${id}" >
                <option>Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
        </div>
    </div>
`;
