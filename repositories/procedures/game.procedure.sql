create or replace function get_player_data_by_id(IN integer)
 returns table(username varchar, health integer, name varchar, mindamage integer, maxdamage integer)
as
$$
  	SELECT P.username, P.health, S.name, S.mindamage, S.maxdamage FROM "test-schema"."PlayerSkill" AS PS
	INNER JOIN "test-schema"."Player" AS P ON PS.player_id = P.player_id
	INNER JOIN "test-schema"."Skill" AS S ON PS.skill_id = S.skill_id
	WHERE PS.player_id = $1
$$
language sql;

create or replace function get_monster_data_by_id(IN integer)
 returns table(name varchar, health integer, mindamage integer, maxdamage integer)
as
$$
  	SELECT name, health, mindamage, maxdamage FROM "test-schema"."Enemy"
	WHERE enemy_id = $1
$$
language sql;

create or replace function insert_match_information(IN int, IN int, IN text, IN int, IN bigint)  
 returns void  
as 
$$
    insert into "test-schema"."Log" (player_id, bot_id, message, match_type, timestamp)
    values ($1, $2, $3, $4, $5);
$$
language sql;