module Jekyll
  module HideCustomBibtex
    def hideCustomBibtex(input)
	    keywords = @context.registers[:site].config['filtered_bibtex_keywords']

	    keywords.each do |keyword|
		    input = input.gsub(/^.*\b#{keyword}\b *= *\{.*$\n/, '')
	    end

      # Reformat author list: convert "Last, First" → "First Last" and strip markers
      input = input.gsub(/^(.*\bauthor\b *= *\{)(.*?)(\}.*)$/) do
        prefix = $1
        author_str = $2
        suffix = $3

        authors = author_str.split(/\s+and\s+/)
        converted = authors.map do |author|
          author = author.strip.gsub(/[*∗†‡§¶‖&^]/, '')
          if author.include?(',')
            last, first = author.split(',', 2).map(&:strip)
            "#{first} #{last}"
          else
            author
          end
        end

        "#{prefix}#{converted.join(' and ')}#{suffix}"
      end

      return input
    end
  end
end

Liquid::Template.register_filter(Jekyll::HideCustomBibtex)
