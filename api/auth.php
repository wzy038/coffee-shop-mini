<?php
header("Content-Type:application/json;charset=utf-8");
require_once 'config.php';

$action = $_GET['action'] ?? '';
$username = $_POST['username'] ?? $_POST['phone'] ?? $_GET['username'] ?? $_GET['phone'] ?? '';
$password = $_POST['password'] ?? $_GET['password'] ?? '';
$nickname = $_POST['nickname'] ?? $_POST['nickName'] ?? $_GET['nickname'] ?? $_GET['nickName'] ?? '';

if(empty($username) || empty($password)){
    echo json_encode(['code'=>400,'msg'=>'请填写完整信息'],JSON_UNESCAPED_UNICODE);
    exit;
}

if($action === 'register'){
    if(empty($nickname)){
        echo json_encode(['code'=>400,'msg'=>'请填写昵称'],JSON_UNESCAPED_UNICODE);
        exit;
    }

    $sql = "SELECT id FROM user WHERE username = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $username);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if(mysqli_num_rows($result) > 0){
        echo json_encode(['code'=>402,'msg'=>'账号已注册'],JSON_UNESCAPED_UNICODE);
        exit;
    }
    mysqli_stmt_close($stmt);

    $memberId = 'VIP' . date('Ymd') . str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
    $safePwd = password_hash($password, PASSWORD_DEFAULT);
    $insertSql = "INSERT INTO user(member_id,username,password,nickname,register_time) VALUES(?,?,?,?,NOW())";
    $stmtInsert = mysqli_prepare($conn, $insertSql);
    mysqli_stmt_bind_param($stmtInsert, "ssss", $memberId, $username, $safePwd, $nickname);
    mysqli_stmt_execute($stmtInsert);
    mysqli_stmt_close($stmtInsert);

    echo json_encode(['code'=>200,'msg'=>'注册成功'],JSON_UNESCAPED_UNICODE);
}

elseif($action === 'login'){
    $sql = "SELECT id,member_id,password,nickname,register_time FROM user WHERE username = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $username);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);
    $user = mysqli_fetch_assoc($res);
    mysqli_stmt_close($stmt);

    if(!$user){
        echo json_encode(['code'=>404,'msg'=>'账号未注册'],JSON_UNESCAPED_UNICODE);
        exit;
    }

    if(!password_verify($password, $user['password'])){
        echo json_encode(['code'=>403,'msg'=>'密码错误'],JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo json_encode([
        'code'=>200,
        'msg'=>'登录成功',
        'data'=>[
            'uid'=>$user['id'],
            'memberId'=>$user['member_id'],
            'username'=>$username,
            'phone'=>$username,
            'nickName'=>!empty($user['nickname']) ? $user['nickname'] : $username,
            'registerTime'=>date('Y-m-d H:i:s', strtotime($user['register_time'])),
            'avatar'=>'',
            'balance'=>0,
            'couponCount'=>0,
            'integral'=>0,
            'pointNum'=>0,
            'level'=>'普通会员'
        ]
    ],JSON_UNESCAPED_UNICODE);
}

else{
    echo json_encode(['code'=>401,'msg'=>'非法操作'],JSON_UNESCAPED_UNICODE);
}

mysqli_close($conn);
?>