jQuery ->
  $('#users').dataTable
    bJQueryUI: true
    bProcessing: true
    bServerSide: true
    sAjaxSource: $('#users').data('source')
