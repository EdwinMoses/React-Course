            var tokenize = function(original) {
              var workbench = original;
              var result = [];
              while (workbench) {
                if (workbench[0] === '<') {
                  length = workbench.indexOf('>') + 1;
                  if (length === 0) {
                    length = 1;
                  }
                } else {
                  length = 1;
                }
                result.push(workbench.substr(0, length));
                workbench = workbench.substr(length);
              }
              return result;
            }
