        var display_item_details = function(label, item) {
          var html_id = item.id + '.' + label;
          return (
            <td className={label} title={label}>
              <input onChange={handle_change}
                id={html_id} className={label}    
                type="checkbox" checked={item[label]} />
            </td>
            );
          };
