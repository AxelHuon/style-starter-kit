tmux new-session -d -s mysession '/bin/bash'
tmux new-window -t mysession:1 -n "mywindow" '/bin/bash'
tmux split-window -h -t mysession:1 'npm start'
tmux select-pane -t mysession:1.0
tmux attach-session -t mysession