import chefClaudeLogo from "../assets/chef-claude-icon.png";

export function Header() {
    return (
        <header className="header">
            <img src={chefClaudeLogo} alt="chef-icon" />
            <h1>Chef Mistral</h1>
        </header>
    );
}
