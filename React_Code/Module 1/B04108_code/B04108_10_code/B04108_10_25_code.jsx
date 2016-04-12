if (activity.all_day) {
                  rendered_activities.push(<li
                    dangerouslySetInnerHTML={{__html:
                    converter.makeHtml(activity.description)
                    .replace('<p>', '').replace('</p>', '')}}
                    />);
                } else if (activity.minutes) {
                  rendered_activities.push(<li
                    dangerouslySetInnerHTML={{__html:
                    hour_options[activity.hours][1] + ':' +
                    minute_options[activity.minutes][1] + ' ' +
                    converter.makeHtml(activity.description)
                    .replace('<p>', '').replace('</p>', '')}}
                    />);
                } else {
                  rendered_activities.push(<li
                    dangerouslySetInnerHTML={{__html:
                    hour_options[activity.hours][1] + ' ' +
                    converter.makeHtml(activity.description)
                    .replace('<p>', '').replace('</p>', '')}}
                    />);
                }
              }
              result.push(<ul className="activities">
                {rendered_activities}</ul>);
            }
          }
        }
        if (entry_displayed) {
          result.push(<hr />);
        }
        return result;
      }
    });
