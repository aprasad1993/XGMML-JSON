var fs = require('fs');
var sax = require('sax');

parser = sax.parser(true);

var elements_array = [];
var nodeCounter = -1;

parser.onerror = function(e) {
    // an error happened.
  };

parser.onopentag = function(node) {(function(){
    // opened a tag. node has "name" and "attributes"
    if (node.name == 'node') {
      nodeCounter++;
      elements_array.push({
      group: 'nodes',
      data: { id: node.attributes.id, label: node.attributes.label, att: [] }
      });
    }

    if (node.name == 'edge') {
      nodeCounter++;
      elements_array.push({
      group: 'edges',
      data: { label: node.attributes.label, source: node.attributes.source, target: node.attributes.target, att: [] }
      });
    }

    if (node.name =='att') {(function(){
      
      elements_array[nodeCounter].data.att.push(
        { name : node.attributes.name, type: node.attributes.type, value: node.attributes.value }
        ); 
      })();
    }
  })();
    
  };

 parser.onend = function() {
    // parser stream is done, and ready to have more stuff written to it.
    console.log("XML has been parsed.\n");
  };


try {
    var file_buf = fs.readFileSync('./graph.xml');
    parser.write(file_buf.toString('utf8')).close();
} catch(ex) {
    // keep 'em silent
}

console.log(JSON.stringify(elements_array));
