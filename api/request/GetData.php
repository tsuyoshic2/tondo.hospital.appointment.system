<?php
  include_once('simple_html_dom.php');
  header('Content-Type: application/json; charset=utf-8');
  header('Access-Control-Allow-Origin: *');
  $html = file_get_html('https://www.who.int/philippines/news/releases');
  $url = 'https://www.who.int/philippines/news';
  $url2 = 'https://www.who.int/';
  
  $sendData = array();
  foreach($html->find('div[id=PageContent_C028_Col00] a.table') as $el){
    $href = $url2.$el->href;
    $timestamp = $el->find('.timestamp',0)->plaintext;
    $heading = $el->find('.heading',0)->plaintext;
    $imageData = $el->find('.background-image');
    $image = $url2.$imageData[0]->{'data-image'};
    $type = $el->find('.sf-tags-list-item',0)->plaintext;
    $newArray = array("Href" => $href, "Timestamp" => strval($timestamp), "Heading" => strval($heading), "Image" => strval($image), "Type" => strval($type));
    array_push($sendData, $newArray);
  }
  echo json_encode($sendData);

?>