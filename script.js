let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'

let countyData
let educationData

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawMap = () => {
  canvas.selectAll('path')
        .data(countyData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr('class', 'county')
        .attr('fill', (d) => {
          let id = d.id
          let county = educationData.find((d) => {
            return d['fips'] === id
          })
          let education = county.bachelorsOrHigher
          if (education <= 15.6) {
            return "#C80000"
          } else if (education > 15.6 && education <= 28.2) {
            return '#AF5835'
          } else if (education > 28.2 && education <= 40.8) {
            return '#D0BE49'
          } else if (education > 40.8 && education <= 53.4) {
            return '#60731E'
          } else {
            return '#338E1B'
          }
  })
        .attr('data-fips', (d) => {
          return d.id
  })
        .attr('data-education', (d) => {
          let id = d.id
          let county = educationData.find((d) => {
            return d['fips'] === id
          })
          let education = county.bachelorsOrHigher
          return education
  })
        .on('mouseover', (event, item) => {
          tooltip.transition()
                .style('visibility', 'visible')
          
          let id = item.id
          let county = educationData.find((d) => {
            return d['fips'] === id
          })
         
          tooltip.text(county.area_name + ", " + county.state + " " + county.bachelorsOrHigher + "%")
          tooltip.attr('data-education', county.bachelorsOrHigher)
  })
        
      .on("mouseout", function(d) {
       tooltip.style('visibility', 'hidden')
  })
}

d3.json(countyURL).then(
  (data, error) => {
    if(error) {
      console.log(error)
    }else {
      countyData = topojson.feature(data, data.objects.counties).features
      
      
      d3.json(educationURL).then(
        (data, error) => {
          if(error) {
            console.log(error)
          }
          else {
            educationData = data
            drawMap()
          }
        })
    }
  })