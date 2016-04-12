        var handle_change = function(event) {
          var address = event.target.id.split('.', 2);
          (that.state.items[parseInt(address[0])][address[1]] =
            !that.state.items[parseInt(address[0])][address[1]]);
          };
