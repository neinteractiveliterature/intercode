jQuery ->
  $('#past_conventions').dataTable({

      "bFilter": false
      "bInfo": false
      "bPaginate": false

    "aaSorting": [[ 1, "asc" ]]

    "aoColumnDefs" : [ {
      "bSortable" : false,
      "aTargets" : [ "no-sort" ]
    } ]

  })

jQuery ->
  $('#upcoming_conventions').dataTable({
    "bFilter": false
    "bInfo": false
    "bPaginate": false

    "aaSorting": [[ 1, "desc" ]]

    "aoColumnDefs" : [ {
      "bSortable" : false,
      "aTargets" : [ "no-sort" ]
    } ]

  })