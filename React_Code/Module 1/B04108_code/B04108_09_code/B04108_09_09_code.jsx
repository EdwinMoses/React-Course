        var display_item = function(item) {
          var rendered_nodes = [];
          for(var index = 0; index < todo_item_names.length;
            index += 1) {
            rendered_nodes.push(
              display_item_details(todo_item_names[index], item)
              );
            }
          return (
            <tr>
              {rendered_nodes}
              <td dangerouslySetInnerHTML={{__html: converter.makeHtml(
                item.description)}} />
            </tr>
            );
          };
