<?php

namespace MorphQL\SymfonyBundle;

use MorphQL\SymfonyBundle\DependencyInjection\MorphQLExtension;
use Symfony\Component\DependencyInjection\Extension\ExtensionInterface;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class MorphQLBundle extends Bundle
{
    public function getContainerExtension(): ?ExtensionInterface
    {
        if (null === $this->extension) {
            $this->extension = new MorphQLExtension();
        }

        return $this->extension;
    }
}
