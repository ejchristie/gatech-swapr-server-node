var db = require('sqliteSetup');

db.serialize(function(){
  if(!exists){
    //stores student accounts. username, full_name, email are PII, so protect them!
    db.run(
      "CREATE TABLE id_map\
      (id INTEGER PRIMARY KEY AUTOINCREMENT,\
      username TEXT UNIQUE ON CONFLICT ROLLBACK NOT NULL ON CONFLICT ROLLBACK,\
      email TEXT NOT NULL ON CONFLICT ROLLBACK UNIQUE ON CONFLICT ROLLBACK,\
      full_name TEXT,\
      pwd_hash TEXT NOT NULL ON CONFLICT ROLLBACK UNIQUE ON CONFLICT ROLLBACK,\
      token TEXT NOT NULL ON CONFLICT ROLLBACK UNIQUE ON CONFLICT ROLLBACK,\
      role_id INTEGER NOT NULL,\
      FOREIGN KEY(role_id) REFERENCES role_map(role_id))"
    );

    db.run(
      "CREATE TABLE role_map\
      (role_id INTEGER NOT NULL,\
      role TEXT NOT NULL)"
    );

    db.run(
      "CREATE TABLE reviews_received\
      (assignment_id INTEGER,\
      author_id INTEGER,\
      URL TEXT,\
      num_reviews INTEGER,\
      FOREIGN KEY(assignment_id) REFERENCES assignment_map(assignment_id),\
      FOREIGN KEY(author_id) REFERENCES id_map(id),\
      FOREIGN KEY(URL) REFERENCES peer_submissions(URL))"
    );

    db.run(
      "CREATE TABLE reviews_pending\
      (assignment_id INTEGER,\
      author_id INTEGER,\
      assigned_rater_id INTEGER,\
      URL TEXT,\
      datetime_assigned DATETIME,\
      datetime_due DATETIME,\
      FOREIGN KEY(assignment_id) REFERENCES assignment_map(assignment_id),\
      FOREIGN KEY(author_id) REFERENCES id_map(id),\
      FOREIGN KEY(URL) REFERENCES peer_submissions(URL))"
    );

    db.run(
      "CREATE TABLE assignment_map\
      (assignment_id INTEGER PRIMARY KEY,\
      assignment_name TEXT,\
      session_id INTEGER,\
      FOREIGN KEY(session_id) REFERENCES session_map(session_id))"
    );

    db.run(
      "CREATE TABLE peer_submissions\
      (id INTEGER NOT NULL,\
      session_id INTEGER NOT NULL,\
      URL TEXT UNIQUE NOT NULL,\
      FOREIGN KEY(id) REFERENCES id_map(id)\
      constraint unq unique (id, session_id))"
    );

    db.run(
      "CREATE TABLE course_map\
      (course_id INTEGER PRIMARY KEY,\
      course_name TEXT NOT NULL)"
    );

    db.run(
      "CREATE TABLE session_map\
      (session_id INTEGER PRIMARY KEY,\
      course_id INTEGER NOT NULL,\
      semester TEXT NOT NULL,\
      year INTEGER NOT NULL,\
      status TEXT NOT NULL,\
      FOREIGN KEY(course_id) REFERENCES course_map(course_id))"
    );

    db.run(
      "CREATE TABLE admin_map\
      (admin_id INTEGER NOT NULL,\
      institution TEXT NOT NULL,\
      department TEXT NOT NULL,\
      )"
    );

    db.run(
      "CREATE TABLE roles\
      (user_id INTEGER NOT NULL,\
      role_id INTEGER NOT NULL,\
      target_id)"
    );

    //populate the role_map table
    db.run("INSERT INTO role_map (role_id, role) VALUES (0, 'root')");
    db.run("INSERT INTO role_map (role_id, role) VALUES (1, 'admin')");
    db.run("INSERT INTO role_map (role_id, role) VALUES (2, 'instructor')");
    db.run("INSERT INTO role_map (role_id, role) VALUES (3, 'student')");

    console.log("Database tables created!");
  }

});
