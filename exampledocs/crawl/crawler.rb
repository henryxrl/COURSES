web_list = ["coursera", "edx", "khan", "udacity", "udemy"]
webid = 0
if (!File.directory?("./xml"))
	Dir.mkdir "./xml"
end

while webid < web_list.length do
	file = "./urls/#{web_list[webid]}-urls.txt"
	puts "Working on: \"#{file}\" ...\n"

	course_list = File.open("./xml/#{web_list[webid]}.xml", 'w')
	course_list << "<add>"
	course_list.close

	docid = 1
	for line in File.open(file, 'r').readlines
	  url = line.chomp
	  puts " #{docid} -> #{url}"
	  `phantomjs ./parsers/text-scraper_#{web_list[webid]}.js #{url} ./xml/#{web_list[webid]}.xml`
	  docid += 1
	end

	course_list = File.open("./xml/#{web_list[webid]}.xml", 'a')
	course_list << "\n</add>"
	course_list.close

	puts "Done with \"#{file}\"!\n\n"
	webid += 1
end