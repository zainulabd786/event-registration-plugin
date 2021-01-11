<?php

/**
 * Plugin Name: Potomac event Registration
 * Description: Potomac Event registation and login
 * Version: 1.0
 * Requires at least: 5.2
 * Requires PHP: 7.2
 * Author: Zainul Abideen
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: nimmio-data-import
 * Domain Path: /languages
 */


add_action('wp_enqueue_scripts', 'enqueue_scripts');
add_action('admin_enqueue_scripts', 'enqueue_scripts');

function enqueue_scripts()
{

    wp_enqueue_script('jquery', ' https://code.jquery.com/jquery-1.9.1.min.js', array(''), '1.9.1', true);
    wp_enqueue_script('poto-registration-js', plugins_url('/js/script.js', __FILE__), array('jquery'));
    wp_enqueue_style('myCSS', plugins_url('/css/style.css', __FILE__));
}


remove_action('admin_color_scheme_picker', 'admin_color_scheme_picker');

//Removes the leftover 'Visual Editor', 'Keyboard Shortcuts' and 'Toolbar' options.

add_action('admin_head', function () {

    ob_start(function ($subject) {

        $subject = preg_replace('#<h[0-9]>' . __("Personal Options") . '</h[0-9]>.+?/table>#s', '', $subject, 1);
        return $subject;
    });
});

add_action('admin_footer', function () {

    ob_end_flush();
});

add_action("show_user_profile", "add_custom_user_profile_fields");
add_action("edit_user_profile", "add_custom_user_profile_fields");
function add_custom_user_profile_fields($user)
{
    $table =
        '
    <table class="form-table">
        <tr>
            <th>
                %1$s
            </th>
            <td>
                <p>Registered on: %2$s</p>
            </td>
        </tr>
    </table>';
    $udata = get_userdata($user->ID);
    $registered = $udata->user_registered;
    printf(
        $table,
        'Registered',
        date("d M Y", strtotime($registered))
    );
}

add_action('show_user_profile', 'extra_user_profile_fields');
add_action('edit_user_profile', 'extra_user_profile_fields');

function extra_user_profile_fields($user)
{
    $existing_documents = json_decode(get_the_author_meta('user_doc', $user->ID));
    $participants_data = json_decode(get_the_author_meta('participants', $user->ID));
    write_log( $participants_data);
?>
    <h3><?php _e("Event Registration Information", "blank"); ?></h3>

    <table class="form-table">
        <tr>
            <th><label for="name_of_team"><?php _e("Name of Team"); ?></label></th>
            <td>
                <span class="name_of_team"><?php echo esc_attr(get_the_author_meta('name_of_team', $user->ID)); ?></span>
            </td>
        </tr>
        <tr>
            <th><label for="team_size"><?php _e("Team Size"); ?></label></th>
            <td>
                <span class="team_size"><?php echo esc_attr(get_the_author_meta('team_size', $user->ID)); ?></span>
            </td>
        </tr>
        <tr>
            <th><label for="team_leader"><?php _e("Team Leader"); ?></label></th>
            <td>
                <span class="team_leader"><?php echo esc_attr(get_the_author_meta('team_leader', $user->ID)); ?></span>
            </td>
        </tr>
        <tr>
            <th><label for="idea_presented"><?php _e("Have you presented this idea elsewhere?"); ?></label></th>
            <td>
                <span class="idea_presented"><?php echo esc_attr(get_the_author_meta('idea_presented', $user->ID)); ?></span>
            </td>
        </tr>
        <tr>
            <th><label for="how_did_you_hear"><?php _e("How did you hear about this contest ?"); ?></label></th>
            <td>
                <span class="how_did_you_hear"><?php echo esc_attr(get_the_author_meta('how_did_you_hear', $user->ID)); ?></span>
            </td>
        </tr>
        <tr>
            <th><label for="participants"><?php _e("Participants"); ?></label></th>
            <td>
                <?php
                    foreach($participants_data as $participant){ ?>
                        <span><?php echo $participant->participant_name ?></span>,<?php
                    }
                ?>
            </td>
        </tr>
        <tr>
            <th><label for="user_doc"><?php _e("Upload Document"); ?></label></th>
            <td>
                <input type="file" name="user_doc" id="user_doc" class="regular-text" /><br />
            </td>
        </tr>
        <tr>
            <th><label for="user_doc"><?php _e("Existing Documents"); ?></label></th>
            <td>
                <input type="hidden" name="docs_to_delete" id="docs_to_delete" />
                <table>
                    <?php
                    if ($existing_documents) {
                        foreach ($existing_documents as $existing_document) {
                            $doc_link = wp_get_attachment_url($existing_document);
                            $doc_name = basename($doc_link); ?>
                            <tr id="doc_<?= $existing_document ?>">
                                <td><a href="<?php echo $doc_link; ?>" target="_blank"><?php echo $doc_name; ?></a></td>
                                <td><button type="button" class="poto_remove_doc" data-id="<?= $existing_document ?>">Remove</button></td>
                            </tr><?php
                                }
                            }

                                    ?>
                </table>
            </td>
        </tr>
    </table>
    <?php }


add_action('personal_options_update', 'save_user_docs');
add_action('edit_user_profile_update', 'save_user_docs');

function save_user_docs($user_id)
{
    if (!current_user_can('edit_user', $user_id)) {
        return false;
    }
    $user_doc = json_decode(get_the_author_meta('user_doc', $user_id));
    if (!empty($_FILES['user_doc']['tmp_name'])) {
        $upload_dir = wp_upload_dir();
        $file_data = $_FILES['user_doc']['tmp_name'];
        $filename =  $_FILES['user_doc']['name'];
        if (wp_mkdir_p($upload_dir['path'])) {
            $file = $upload_dir['path'] . '/' . $filename;
        } else {
            $file = $upload_dir['basedir'] . '/' . $filename;
        }
        move_uploaded_file($file_data, $file);
        $wp_filetype = wp_check_filetype($filename, null);
        $attachment = array(
            'post_mime_type' => $wp_filetype['type'],
            'post_title' => sanitize_file_name($filename),
            'post_content' => '',
            'post_status' => 'inherit'
        );
        $attach_id = wp_insert_attachment($attachment, $file);
        require_once(ABSPATH . 'wp-admin/includes/image.php');
        $attach_data = wp_generate_attachment_metadata($attach_id, $file);
        wp_update_attachment_metadata($attach_id, $attach_data);
        $user_doc[] = $attach_id;
        update_user_meta($user_id, 'user_doc', json_encode($user_doc));
    }

    if (!empty($_POST['docs_to_delete'])) {


        $user_doc = array_filter($user_doc, function ($value) {
            $docs_to_delete = explode(",", $_POST['docs_to_delete']);
            return !in_array($value, $docs_to_delete);
        });
        update_user_meta($user_id, 'user_doc', json_encode(array_values($user_doc)));
    }
}


add_shortcode('poto_login_form', 'poto_login_form');
function poto_login_form($atts)
{

    ob_start();
    $atts = shortcode_atts(array(), $atts, 'login_form');
    $args = array("echo" => false, 'redirect' => get_edit_profile_url());
    return wp_login_form($args);
}

add_shortcode('poto_registration_form', 'poto_registration_form');
function poto_registration_form($atts)
{

    // if (is_user_logged_in()) {
    //     wp_redirect(get_edit_profile_url());
    //     exit;
    // }
    global $post;

    ob_start();
    $atts = shortcode_atts(array(), $atts, 'registration_form');
    if (!empty($_GET['registered']) && $_GET['registered'] === "ok") { ?>
        <div class="successfully_registered">
            Successfully Registered
        </div><?php
            } ?>
    <div class="wrap">
        <form action="<?= admin_url('admin-post.php') ?>" method="post" enctype="multipart/form-data">
            <input type="hidden" name="action" value="poto_user_registration">
            <input type="hidden" name="redirect_url" value="<?php echo get_permalink($post->ID) . '?registered=ok' ?>" />
            <?php wp_nonce_field("poto_user_registration_verify"); ?>
            <input type="text" name="name_of_team" placeholder="Name of Team">
            <input type="number" value="1" min="1" max="4" name="team_size" id="team_size" placeholder="Team Size">
            <input type="text" name="team_leader" placeholder="Team Leader">

            <h1>Participant's Details</h1>
            <div id="participants_details"></div>
            <label>
                <input type="checkbox" name="idea_presented" id="idea_presented" /> Have you presented this idea elsewhere?
            </label>
            <select name="how_did_you_hear" id="how_did_you_hear">
                <option>How did you hear about this contest?</option>
                <option value="Facebook">Facebook</option>
                <option value="LinkedIn">LinkedIn</option>
            </select>
            <input type="password" name="password" id="password" placeholder="password">
            <input type="password" name="confirm_password" id="confirm_password" placeholder="confirm password">
            <button type="submit" id="poto_register" class="button button-primary button-large">Register</button>
        </form>
    </div><?php
            return ob_get_clean();
        }


        function poto_user_registration()
        {
            check_admin_referer("poto_user_registration_verify");
            $upload_dir = wp_upload_dir();

            $name_of_team = $_POST['name_of_team'];
            $team_size = $_POST['team_size'];
            $team_leader = $_POST['team_leader'];
            $idea_presented = !empty($_POST["idea_presented"]) ? "Yes" : "No";
            $how_did_you_hear = $_POST["how_did_you_hear"];

            $participants = array();
            for ($i = 0; $i <  $team_size; $i++) { //read participants data from post and prepares a proper array of associative arrays for multiple participants
                $college_id_card = $_FILES["college_id_card_" . $i];
                $photo_id_card = $_FILES['photo_id_card_' . $i];

                if (wp_mkdir_p($upload_dir['path'])) {
                    $college_id_card_file = $upload_dir['path'] . '/' . $college_id_card['name'];
                    $photo_id_card_file = $upload_dir['path'] . '/' . $photo_id_card['name'];
                } else {
                    $college_id_card_file = $upload_dir['basedir'] . '/' . $college_id_card['name'];
                    $photo_id_card_file = $upload_dir['basedir'] . '/' . $photo_id_card['name'];
                }

                move_uploaded_file($college_id_card['tmp_name'], $college_id_card_file);
                move_uploaded_file($photo_id_card['tmp_name'], $photo_id_card_file);

                $college_id_card_wp_filetype = wp_check_filetype($college_id_card['name'], null);
                $photo_id_card_wp_filetype = wp_check_filetype($photo_id_card['name'], null);

                $college_id_card_attachment = array(
                    'post_mime_type' => $college_id_card_wp_filetype['type'],
                    'post_title' => sanitize_file_name($college_id_card['name']),
                    'post_content' => '',
                    'post_status' => 'inherit'
                );

                $photo_id_card_attachment = array(
                    'post_mime_type' => $photo_id_card_wp_filetype['type'],
                    'post_title' => sanitize_file_name($photo_id_card['name']),
                    'post_content' => '',
                    'post_status' => 'inherit'
                );

                $college_id_card_attach_id = wp_insert_attachment($college_id_card_attachment, $college_id_card_file);
                $photo_id_card_attach_id = wp_insert_attachment($photo_id_card_attachment, $photo_id_card_file);
                require_once(ABSPATH . 'wp-admin/includes/image.php');
                $college_id_card_attach_data = wp_generate_attachment_metadata($college_id_card_attach_id, $college_id_card_file);
                $photo_id_card_attach_data = wp_generate_attachment_metadata($photo_id_card_attach_id, $photo_id_card_file);
                wp_update_attachment_metadata($college_id_card_attach_id, $college_id_card_attach_data);
                wp_update_attachment_metadata($photo_id_card_attach_id, $photo_id_card_attach_data);
                $participants[] = array(
                    "participant_name"  => $_POST["participant_name_" . $i],
                    "participant_profession" => $_POST["participant_profession_" . $i],
                    "participant_dob" => $_POST["participant_dob_" . $i],
                    "college_name" => $_POST["college_name_" . $i],
                    "degree" => $_POST["degree_" . $i],
                    "mode_of_study" => $_POST["mode_of_study_" . $i],
                    "graduation_date" => $_POST["graduation_date_" . $i],
                    "participant_email" => $_POST["participant_email_" . $i],
                    "participant_contact_number" => $_POST["participant_contact_number_" . $i],
                    "participants_city" => $_POST["participants_city_" . $i],
                    "participants_nationality" => $_POST["participants_nationality_" . $i],
                    "college_id_card" => $college_id_card_attach_id,
                    "photo_id_card" => $photo_id_card_attach_id
                );
            }
            // echo "<pre>";
            // print_r($_POST);
            // echo "======================";
            // print_r($participants);
            // echo "[=========";
            // print_r(json_encode($participants));
            // echo "============";
            // print_r($_FILES);
            $args = array(
                'user_email' => $participants[0]['participant_email'],
                'user_pass' => $_POST['password'],
                'user_login' => $participants[0]['participant_email'],
                'user_registered' => date('Y-m-d H:i:s')
            );
            $user_id = wp_insert_user($args);
            add_user_meta($user_id, 'name_of_team', $name_of_team, false);
            add_user_meta($user_id, 'team_size', $team_size, false);
            add_user_meta($user_id, 'team_leader', $team_leader, false);
            add_user_meta($user_id, 'idea_presented', $idea_presented, false);
            add_user_meta($user_id, 'how_did_you_hear', $how_did_you_hear, false);
            add_user_meta($user_id, 'participants', json_encode($participants), false);
            wp_redirect($_POST['redirect_url']);
        }

        add_action("admin_post_nopriv_poto_user_registration", "poto_user_registration");
        add_action("admin_post_poto_user_registration", "poto_user_registration");




        if (!function_exists('write_log')) {

            function write_log($log)
            {
                if (true === WP_DEBUG) {
                    if (is_array($log) || is_object($log)) {
                        error_log(print_r($log, true));
                    } else {
                        error_log($log);
                    }
                }
            }
        }


        add_action('wp', 'add_login_check');
