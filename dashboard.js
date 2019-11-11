$(function(){
  var cleaned_data = new Array()
  $.getJSON('./assets/springfield_converted_json.js',function(data){
      console.log(data)
      for(i = 0; i < data[0].length; i = i + 6){
        console.log(i)

      };

  }).error(function(){
      console.log('error');
  });
});