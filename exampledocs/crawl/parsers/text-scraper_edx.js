var page = require('webpage').create();
var system = require('system');
var fs = require('fs');

if(system.args.length !== 3) {
  console.log('Usage: phantomjs text-scraper.js <url> <output file>');
  phantom.exit();
}

var url = system.args[1];
var outfile = system.args[2];

page.onConsoleMessage = function(msg) {
  phantom.outputEncoding = "utf-8";
  console.log(msg);
};

page.open(url, function(status) {
  var output = "\n<doc>\n\t<field name=\"course_url\">" + url + "</field>\n\t"
  if(status === 'success') {
    setTimeout(function() {
      var text = page.evaluate(function () {
        var title = "<field name=\"course_title\">" + document.title.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') + "</field>\n\t";
        
        var price = "<field name=\"course_price\">Free</field>\n\t";

        var length;
        try
        {
          length = "<field name=\"course_length\">" + document.body.getElementsByClassName("course-detail-length")[0].innerText.substring("Course Length: ".length).trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') + "</field>\n\t";
        }
        catch (err)
        {
          length = "<field name=\"course_length\">Undefined</field>\n\t";
        }
        
        var workload;
        try
        {
          workload = "<field name=\"course_workload\">" + document.body.getElementsByClassName("course-detail-effort")[0].innerText.substring("Estimated effort: ".length).trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') + "</field>\n\t";
        }
        catch (err)
        {
          workload = "<field name=\"course_workload\">Undefined</field>\n\t";
        }

        var language = "<field name=\"course_language\">Undefined</field>\n\t";

        var instructors = "<field name=\"course_instructor\">Undefined</field>\n\t";
        var temp_instructors = "";
        var i = 0;
        while (true)
        {
          var instructor;
          try
          {
            instructor = "<field name=\"course_instructor\">" + document.body.getElementsByClassName("staff-list")[0].getElementsByTagName("li")[i].childNodes[3].childNodes[1].innerText.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') + "</field>\n\t";
            temp_instructors += instructor;
            i++;
          }
          catch (err)
          {
            break;
          }
        }
        if (temp_instructors != "")
          instructors = temp_instructors;

        var instructor_intros = "<field name=\"course_instructor_intro\">Undefined</field>\n\t";
        var temp_instructor_intros = "";
        i = 0;
        while (true)
        {
          var instructor_intro;
          try
          {
            instructor_intro = "<field name=\"course_instructor_intro\">" + document.body.getElementsByClassName("staff-list")[0].getElementsByTagName("li")[i].childNodes[3].childNodes[3].innerText.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') + "</field>\n\t";
            temp_instructor_intros += instructor_intro;
            i++;
          }
          catch (err)
          {
            break;
          }
        }
        if (temp_instructor_intros != "")
          instructor_intros = temp_instructor_intros;

        var categories = "<field name=\"course_category\">Undefined</field>\n\t";

        var intro;
        try
        {
          intro = "<field name=\"course_intro\">" + document.body.getElementsByClassName("course-detail-subtitle copy-lead")[0].innerText.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') + "</field>\n\t";
        }
        catch (err)
        {
          intro = "<field name=\"course_intro\">Undefined</field>\n\t";
        }

        var body;
        try
        {
          body = "<field name=\"course_body\">" + document.body.getElementsByClassName("course-section course-detail-about")[0].innerText.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') + document.body.getElementsByClassName("view-display-id-errata")[0].innerText.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') + "</field>\n";
        }
        catch (err)
        {
          try
          {
            body = "<field name=\"course_body\">" + document.body.getElementsByClassName("course-section course-detail-about")[0].innerText.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') + "</field>\n";
          }
          catch (err)
          {
            body = "<field name=\"course_body\">Undefined</field>\n\t";
          }
        }

        return title + price + length + workload + language + instructors + instructor_intros + categories + intro + body;
      });

      output += text + "</doc>";
      fs.write(outfile, output, 'a');
      
    }, 1000);
    setTimeout(function () {
      phantom.exit()
    }, 1000);
  } else {
    console.log("Error!")
    phantom.exit()
  }
});