# 创建.ssh目录
$sshDir = "$env:USERPROFILE\.ssh"
if (!(Test-Path -Path $sshDir)) {
    New-Item -ItemType Directory -Path $sshDir -Force
    Write-Host ".ssh目录已创建: $sshDir"
}

# 生成SSH密钥对（无密码）
$keyPath = "$sshDir\id_ed25519"
$email = "user@example.com"

# 使用简化的ssh-keygen命令生成密钥
Write-Host "正在生成SSH密钥对..."
ssh-keygen -t ed25519 -C $email -f $keyPath -N "" -q

# 检查生成结果
if (Test-Path -Path $keyPath) {
    Write-Host "SSH密钥对生成成功！"
    Write-Host "私钥路径: $keyPath"
    Write-Host "公钥路径: $keyPath.pub"
    Write-Host ""
    Write-Host "请将以下公钥内容添加到GitHub账户的SSH设置中:"    
    Write-Host "---------------------------------------------"
    Get-Content "$keyPath.pub"
    Write-Host "---------------------------------------------"
    Write-Host ""
    Write-Host "添加后，可以使用以下命令测试连接："
    Write-Host "ssh -T git@github.com"
} else {
    Write-Host "SSH密钥对生成失败，请检查错误信息。"
}