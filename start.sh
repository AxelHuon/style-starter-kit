tmux new-session -d -s mysession '/bin/bash'  # Crée une session tmux avec bash
tmux split-window -h 'npm start'             # Divise la fenêtre et lance npm start
tmux select-pane -t 0
tmux attach-session -t mysession
